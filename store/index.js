
import socket from "./socket";

// New import statements
import foodApp from "./reducers";
import { CurrentUser } from "./actionTypes";

let userID = -1;
const Partner = {
  userID: -1,
  socket: undefined,
};

let placeDetails = function () {
  this.places = [];
};
let SessionKey = '';

let PD = new placeDetails();

let photos = [];
socket.on("connect", () => {
  // get userId from server
  socket.on("userID", (data) => {
    console.log("1) data is " + data);
    console.log("Connected to socket server");
    userID = data;
    console.log("User socket is " + userID);
  });
  socket.on("secondGuest", (user) => {
    console.log("Added new user");
    Partner.userID = user.userID;
    Partner.socket = user.socket;
  });
  socket.on("restaurants", (data) => {
    let sdata = "";
    
    sdata = JSON.parse(data);
    if (sdata.status === "OK") {
      console.log("Status: " + sdata.status);
      console.log("Results: " + sdata.results.length);
      for (let p = 0; p < sdata.results.length; p++) {
        PD.places.push(sdata.results[p]);
      }
      for (let r = 0; r < sdata.results.length; r++) {
        console.log("----------------------------------------------");
        console.log(PD.places[r].name);
        console.log(
          "Place ID (for Place Detail search on Google):" +
            PD.places[r].place_id
            
            // place id ^^ for place details search
        );
        console.log("Rating: " + PD.places[r].rating);
        console.log("Vicinity: " + PD.places[r].vicinity);
      }
    } else {
      console.log(sdata.status);
    }
  });
  socket.on('photos', (data) => {
   
    photo = data.toString('ascii');
    console.log('photo: ' + photo);
    photos.push(photo);
  });
  socket.on("key", (data) => {
    SessionKey = data;
  })
  socket.on("found the one", (data) => {
    console.log("both users chose " + data);
  });

});


