// Require socket.io and start a server at port 8000
const io = require("socket.io"),
  server = io.listen(8000);

// Require JS google maps services for Places API
// Required for searching nearby restaurants
const { Client, Status } = require("@googlemaps/google-maps-services-js");

//Required to create Places API requests
let https = require("follow-redirects").https;

//Required to generate a random string to be sent as a key
let crypto = require("crypto");

const RADIUS = 4828;

// Find places within the specified radius, based on the coordinates
//provided by the getCoordinates function

function placeSearch(latitude, longitude, radius, socket) {
  /* This part of the code is used to send the HTTP request to the Places API
   * The PlaceResponse function is the part of the code that is parses the JSON response
   * Note: you can change "&type=___" to a couple of different things
   * (e.g. restaurant, meal_takeaway, meal_delivery, etc.) and change the radius (which is
   * measured in meters).
   * The results are then sent to the clients in order to be parsed on the client-side.
   */

  https.request({
        host: "maps.googleapis.com",
        path:
          "/maps/api/place/nearbysearch/json?location=" +
          latitude +
          "," +
          longitude +
          "&radius=" +
          radius +
          "&type=meal_takeaway&key=AIzaSyBXKa025y69ZY6Uj3vCMD_JEe7Nqx5o7hI",
        method: "GET", } ,
      /*
       * This callback is used to send the info to the user requesting restaurant information.
       */
      function(response){
        let data = "";
        console.log("UserID parameter is " + socket.id);

        response.on("data", function (chunk) {
          data += chunk;
        });

        response.on("end", function () {
          socket.emit("restaurants", data);
        });
      }).end();
}

// Variables used to hold clients and client information
let clientSockets = new Map();
let users = new Map();
let counter = 0;

// Variables used to store sessions
let Sessions = new Map();
let SessionsKeys = [];

// Used to store the information of sessions and active sessions
class Session {
  constructor(host, guest, key) {
    this.host = host;
    this.guest = undefined;
    this.key = key;
  }

  compareLikes(){
    console.log("In CompareLikes(): ")
    let user1, user2;
    user1 = users.get(this.host);
    user2 = users.get(this.guest);
    let length = Math.min(user1.length, user2.length);
    console.log("length: " + length);
    for(let i = 0; i < length; i++) {
      console.log(user1.results[i]);
      if(user1.results[i].Choice && user2.results[i].Choice) {
        console.log("Both users agreed to " + user1.results[i].Name);
        let client1, client2;
        client1 = clientSockets.get(this.host);
        client2 = clientSockets.get(this.guest);
        client1.emit("found the one", user1.results[i].Name);
        client2.emit("found the one", user2.results[i].Name);
      }
    }
  }
}

// Class used to store user's location and userID
class User {
  constructor(username, lon, lat) {
    this.username = username;
    this.lon = lon;
    this.lat = lat;
    this.info = [false, false];
    this.results = [];
    this.length = 0;
  }
}

// event fired every time a new client connects:
server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);

  // initialize this client's sequence number
  counter = counter + 1;
  clientSockets.set(counter, socket);

  // initialize the client's user object and add it to the map
  const user = new User(counter, 0.0, 0.0, socket);
  users.set(counter, user);

  // send the user their ID in the server
  socket.emit("userID", counter);

  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    clientSockets.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });

  // Give client a userID and add them to the list.
  socket.on("needs-ID", () =>{
    counter = counter + 1;
    clientSockets.set(counter, socket);
    // initialize the client's user object and add it to the map
    const user = new User(counter, 0.0, 0.0, socket);
    users.set(counter, user);
    socket.emit("userID", counter);
  })

  socket.on("latitude", (lat) => {
    console.log("User coordinates are " + lat);
    let temp = users.get(counter);
    temp.lat = lat;
    temp.info[0] = true;
  });

  socket.on("longitude", (lon) => {
    let temp = users.get(counter);
    temp.lon = lon;
    temp.info[1] = true;
    console.log("User " + counter + " has longitude/latitude: " + temp.lon);
  });

  /* Wait for a client to send a request for restaurants with their userID included.
   * This uses the userID sent to get the client information from the map and then
   * calls the searchPlaces function.
   */

  socket.on("get-restaurant", (userID) => {
    console.log("Restaurant request received");
    console.log("User " + userID + " has requested to see restaurants");
    let userSocket;
    // check if the user currently has stored coordinates
    let temp = users.get(userID);
    // check if the user has both longitude and latitude values stored.
    try {
      if (temp.info[0] !== true || temp.info[1] !== true) {
        // If both coordinates are not found in the user's information
        // send an error signal to the client

        userSocket = clientSockets.get(userID);
        userSocket.emit("error", userID);
      } else {
        // If the user location is stored, call the search function
        userSocket = clientSockets.get(userID);
        placeSearch(temp.lat, temp.lon, RADIUS, userSocket);
        console.log("Places have been searched using ");
      }
    }
    catch (e) {
      console.log(e);
    }

  });

  /* Listens for a request to be a host from a user, then
   * generates a key of 6 strings to identify the session.
   * This session is created and stored in a map by the key value, then
   * the server sends this key to the host for them to share.
   */
  socket.on("host-req", (userID) => {
    // Get a random 6-character key to store a session
    let id = crypto.randomBytes(3).toString("hex");
    console.log("session key is " + id);

    // Push the key into the keys array and create new Session to insert in map
    SessionsKeys.push(id);
    let newSess = new Session(userID, -1, id);
    Sessions.set(id, newSess);

    // send the key to the client that is requesting to be a host
    console.log("size of the sessionskey array is " + SessionsKeys.length);
    socket.emit("host-info", id);
  });

  /* Listens for a guest's request to join a session and receives
   * the user's input as a key and their userID. The user is added
   * to the session as a guest if their session key is valid.
   */
  socket.on("session-req", (data) => {
    console.log("the session data is " + data);
    // Search through the SessionKeys array and find the
    // key received by the client.
    let temp = SessionsKeys.find(function () {
      for (let i = 0; i < SessionsKeys.length; i++) {
        console.log("in current session" + SessionsKeys[i]);
        if (SessionsKeys[i] === data.key) {
          return true;
        }
      }
      return false;
    });
    //Check if the key received by the server is valid.
    if (temp === undefined) {
      console.log("key not found in array");
    }
    else {
      // Get the session with the corresponding key and get the host
      console.log("found in the array");
      let sess = Sessions.get(data.key);
      let host = sess.host;
      console.log("The host of this session is" + host);

      // Set the user's ID as the guest for the session
      console.log("The guest of this session is " + data.userID);
      sess.guest = data.userID;
      console.log("the host socket is " + clientSockets.get(host).id);
      console.log("Current sessions are " + Sessions.get(data.key));
      console.log("Current session joined is " + sess.key);

      // Send the start message to both the host and the guest.
      socket.emit("Start", data.userID);
      socket.emit("Start", data.key);
      console.log("1/2 Start message sent to " + socket);
      clientSockets.get(host).emit("Start", host);
      console.log("2/2 Start message sent to " + socket);
      clientSockets.get(host).emit("key", data.key);
    }
  });
  socket.on("yes", (data) => {
    console.log("UserID " + data.userID + " said yes to " + data.rest);
    let client = users.get(data.userID);
    let temp = {Name: data.rest, Choice: true}
    console.log("in yes listener " + temp);
    client.results.push(temp);
    client.length = client.length + 1;
    console.log("in yes listener, results is " + client.results[0].Choice);
    let sess = Sessions.get(data.key)
    sess.compareLikes();
  });
  socket.on("no", (data) => {
    console.log("UserID " + data.userID + " said no to " + data.rest);
    let client = users.get(data.userID);
    let temp = {Name: data.rest, Choice: false }
    client.results.push(temp);
    client.length = client.length + 1;
    let sess = Sessions.get(data.key);
    sess.compareLikes();
  });
});
