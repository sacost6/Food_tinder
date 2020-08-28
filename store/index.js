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

  socket.on("key", (data) => {
    SessionKey = data;
  });

  socket.on("amount of restaurants", (data) =>{
    numRestaurants = data;
    console.log("Number of expected restaurants from results are " + data);
  });

  socket.on("first", () => {
    first = true;
  });

});

export { userID, Partner, PD, SessionKey, numRestaurants, first, offset };
