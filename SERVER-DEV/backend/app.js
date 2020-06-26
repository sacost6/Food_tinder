// Require socket.io and start a server at port 8000
const
    io = require("socket.io")(http),
    server = io.listen(8000);

// Require JS google maps services for Places API 
// Required for searching nearby restaurants 
const { Client, Status } = require('@googlemaps/google-maps-services-js');

//Required to create Places API requests 
let https = require('follow-redirects').https;

//Required to generate a random string to be sent as a key
let crypto = require("crypto");


let placeDetails = function () {
    this.places = [];
};

// Find places within the specified radius, based on the coordinates 
//provided by the getCoordinates function

function placeSearch(latitude, longitude, radius, socket) {
    /* This part of the code is used to send the HTTP request to the Places API
     * The PlaceResponse function is the part of the code that is parses the JSON response
     * Note: you can change "&type=___" to a couple of different things 
     * (e.g. restaurant, meal_takeaway, meal_delivery, etc.) and change the radius (which is 
     * measured in meters).
     */

    https.request({
        host: 'maps.googleapis.com',
        path: '/maps/api/place/nearbysearch/json?location=' +
            latitude + ',' + longitude + '&radius=' + radius + '&type=meal_takeaway&key=AIzaSyBXKa025y69ZY6Uj3vCMD_JEe7Nqx5o7hI',
        method: 'GET'
    },
        (socket) => PlaceResponse).end();
}

/*
 * This function is called after placeSearch in order to parse the JSON file that is 
 * returned after the query. 
 * TODO: Only 20 responses are sent and some fast food places are not shown 
 * (e.g. McDonald's, Burger King, etc.). Try to find out how to get more than 20 results
 * and how to get these restaurants included in the result.
 */
function PlaceResponse(response, socket) {
    let p;
    let data = "";
    let sdata = "";
    let PD = new placeDetails();

    response.on('data', function (chunk) {
        data += chunk;
    });
    response.on('end', function () {
        sdata = JSON.parse(data);
        if (sdata.status === 'OK') {
            console.log('Status: ' + sdata.status);
            console.log('Results: ' + sdata.results.length);
            for (p = 0; p < sdata.results.length; p++) {
                PD.places.push(sdata.results[p]);
            }
            for (r = 0; r < sdata.results.length; r++) {
                console.log('----------------------------------------------');
                console.log(PD.places[r].name);
                console.log('Place ID (for Place Detail search on Google):' + PD.places[r].place_id);
                console.log('Rating: ' + PD.places[r].rating);
                console.log('Vicinity: ' + PD.places[r].vicinity);
            }

        }
        else {
            console.log(sdata.status);
        }
    })
}
// Variables used to hold clients and client information 
let
    clientSockets = new Map();
    users = new Map();
    counter = 0;


// Variables used to store sessions 
let
    Sessions = new Map();
    counter = 0;
    SessionsKeys = [];

// Used to store the information of sessions and active sessions 
class Session {
    constructor(host, guest, key) {
        this.host = host;
        this.guest = undefined;
        this.key = key;
    }
}

class User {
    constructor(username, lon, lat, socket) {
        this.username = username;
        this.lon = lon;
        this.lat = lat;
        this.socket = socket;
    }
}



// event fired every time a new client connects:
server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // initialize this client's sequence number
    counter = counter + 1;
    clientSockets.set(counter, socket);
<<<<<<< HEAD
    console.log('Counter number ' + counter);
=======
>>>>>>> 8b28ece5b4b7c6d3a582e417b09ec6e51d20e9f4
    // initialize the client's user object and add it to the map
    const user = new User(counter, 0.0, 0.0, socket);
    users.set(counter, user);
    // send the user their ID in the server
    socket.emit('userID', counter);
    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        clientSockets.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
    socket.on('latitude', (lat) => {
        console.log("User coordinates are " + lat);
        let temp = users.get(counter);
        temp.lat = lat;
        temp.info[0] = true;
    });

    socket.on('longitude', (lon) => {
        let temp = users.get(counter);
        temp.lon = lon;
        temp.info[1] = true;
        console.log("User " + counter + " has longitude/latitude: " + temp.lon);
    })

    /* Wait for a client to send a request for restaurants with their userID included. 
     * This uses the userID sent to get the client information from the map and then 
     * calls the searchPlaces function.  
     */
    /* 
    socket.on('get-restaurant', (userID) => {
        console.log("Restaurant request received");
        console.log("User " + userID + " has requested to see restaurants")
        console.log(users.get(userID).lon + " " + users.get(userID).lat);
        // check if the user currently has stored coordinates 
        temp = users.get(userID);
        // check if the user has both longitude and latitude values stored.
        if(temp.info[0] != true || temp.info[1] != true) {
            socket.emit('error', userID);
        }
        else {
            placeSearch(temp.lat, temp.lon, 4828, socket);
            console.log("Places have been searched")
        }
    }); */

    /* Listens for a request to be a host from a user, then 
     * generates a key of 6 strings to identify the session. 
     * This session is created and stored in a map by the key value, then
     * the server sends this key to the host for them to share. 
     */
    socket.on('host-req', (userID) => {
        let id = crypto.randomBytes(3).toString('hex');
        console.log('session key is ' + id);
        SessionsKeys.push(id);
        let host = userID;
        let newSess = new Session(host, -1, id);
        Sessions.set(id, newSess);
        console.log("size of the sessionskey array is " + SessionsKeys.length);
        socket.emit('host-info', id);

    });

    /* Listens for a guest's request to join a session and receives
     * the user's input as a key and their userID. The user is added 
     * to the session as a guest if their session key is valid. 
     */
    socket.on('session-req', (data, userID) => {
        console.log("the session data is " + data);
        let temp = SessionsKeys.find(function () {
            for (let i = 0; i < SessionsKeys.length; i++) {
                console.log("in current session" + SessionsKeys[i]);
                if (SessionsKeys[i] === data.key) {
                    return true;
                }
            }
            return false;
        });

        if (temp === undefined) {
            console.log("key not found in array");
        }
        else {
            console.log('found in the array')
            let sess = Sessions.get(data.key);
            let host = sess.host;
<<<<<<< HEAD
            console.log('The session is ' + sess.key);
            console.log("The host of this session is" + sess.host);
            console.log("The guest of this session is " + data.userID);
            console.log("the host socket is " + clientSockets.get(host));
            sess.guest = data.userID;
            console.log("Current sessions are " + Sessions.get(data.key));
            console.log("Current session joined is " + sess.key);
            socket.emit('Start', data.userID);
            console.log('1/2 Start message sent to ' + socket);
           // clientSockets.get(host).emit('Start', host);
            console.log('2/2 Start message sent to ' + socket);
=======
            console.log("The host of this session is" + host );
            console.log("The guest of this session is " + userID);
            console.log("the host socket is " + clientSockets.get(host));
            sess.guest = users.get(data.userID);
            console.log("Current sessions are " + Sessions.get(data.key));
            console.log("Current session joined is " + sess.key);
            socket.emit('Start', data.userID);
            clientSockets.get(host).emit('Start', host);
>>>>>>> 8b28ece5b4b7c6d3a582e417b09ec6e51d20e9f4
        }
    });
});




