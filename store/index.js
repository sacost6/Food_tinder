import { createStore } from "redux";
import socket from "./socket";

// New import statements
import foodApp from "./reducers";
import { CurrentUser, SessionKey } from "./actionTypes";

export const store = createStore(foodApp);
let userID = -1;
const Partner = {
  userID: -1,
  socket: undefined,
};
let placeDetails = function () {
  this.places = [];
};

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
    let PD = new placeDetails();
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
        );
        console.log("Rating: " + PD.places[r].rating);
        console.log("Vicinity: " + PD.places[r].vicinity);
      }
    } else {
      console.log(sdata.status);
    }
  });
});

export { userID, Partner };
