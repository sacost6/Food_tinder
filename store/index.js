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
let connection = false;
let timeout;

function setConnectionTrue() {
  connection=true;
}

function setConnectionFalse() {
  connection=false;
}

socket.on("connect", () => {
  connection = true;
  // get userId from server
  socket.on("userID", (data) => {
    userID = data;
  });

  socket.on("disconnect", function () {
    console.log("Disconnected from server");
    connection = false;
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

export { userID, Partner, PD, SessionKey, numRestaurants,
  first, offset, connection, setConnectionFalse, setConnectionTrue };
