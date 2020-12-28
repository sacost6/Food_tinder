import socket from "./socket";

// New import statements
import foodApp from "./reducers";
import { CurrentUser } from "./actionTypes";

let Rests = [];
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
let key = 0;
let timeout;

socket.on("connect", () => {
  // get userId from server
  socket.on("userID", (data) => {
    userID = data;
  });

  socket.on("disconnect", function () {
    console.log("Disconnected from server");
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

export { userID, Partner, PD, SessionKey, numRestaurants, first, offset };
