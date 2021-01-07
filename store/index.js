import socket from "./socket";
import * as rootNavigation from "../rootNavigation";

let userID = -1;
const Partner = {
  userID: -1,
  socket: undefined,
};
let numRestaurants = 0;
let offset = 0.000000000000002;
let first = false;
let placeDetails = function () {
  this.places = [];
};
let SessionKey = "";
let PD = new placeDetails();


class Timeout {

  // Function passsed as callback for timeout

// Function used to reset the timeout
  startTimeout() {
    console.log("Starting the timeout")
    this.timeout = setTimeout(() => {
      console.log("In timeout function! (index.js)")
      if(socket.connected === false) {
        rootNavigation.navigate("ConnectionError");
        console.log("Timer done, no response from the server");
        setConnectionFalse();
      }
      else {
        setConnectionTrue();
        this.resetTimeout();
      }
    }, 10000);
  }

  resetTimeout() {
    clearTimeout(this.timeout);
    this.timeout = 0;
    this.startTimeout();
  }

}

socket.on("connect", () => {
  // get userId from server
  socket.on("userID", (data) => {
    userID = data;
  });

  socket.on("disconnect", function () {
    console.log("Disconnected from server");
    rootNavigation.navigate("ConnectionError");
  });

  socket.on("secondGuest", (user) => {
    Partner.userID = user.userID;
    Partner.socket = user.socket;
  });

  socket.on("host-info", (data) => {
    SessionKey = data;
  });

  socket.on("key", (data) => {
    SessionKey = data;
  });

  socket.on("amount of restaurants", (data) =>{
    numRestaurants = data;
  });

  socket.on("first", () => {
    first = true;
  });

});

let connTimeout = new Timeout();
connTimeout.startTimeout();

export { userID, Partner, PD, SessionKey, numRestaurants,
  first, offset, connTimeout};
