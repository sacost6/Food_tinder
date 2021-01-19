import socket from "./socket";
import * as rootNavigation from "../rootNavigation";

let userID = -1;

let offset = 0.000000000000002;
let first = false;
let placeDetails = function () {
  this.places = [];
};
let SessionKey = "";
let PD = new placeDetails();
let timeoutStarted = false;

class Timeout {

  // Function passsed as callback for timeout

// Function used to reset the timeout
  startTimeout() {
    timeoutStarted = true;
    //console.log("Starting the timeout")
    this.timeout = setTimeout(() => {
      //console.log("In timeout function! (index.js)")
      if(socket.connected === false) {
        rootNavigation.navigate("ConnectionError");
        //console.log("Timer done, no response from the server");
      }
      else {
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
  userID = socket.id

  socket.on("disconnect", function () {
    console.log("Disconnected from server, in index.js");
  });

});
let connTimeout = new Timeout();
if(timeoutStarted === false) {
  connTimeout.startTimeout();
}

export { userID, PD, SessionKey,
  first, offset, connTimeout};
