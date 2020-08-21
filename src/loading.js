import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import socket from "../store/socket";
import { userID, SessionKey } from "../store/index";



const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let photos = [];
let restaurants = [];

export default class host extends React.Component {

  constructor(props) {

    super(props);
    let counter = 0;
    socket.emit('get-restaurant', {UserID: userID, key: SessionKey});
    const { navigate } = this.props.navigation;
    socket.on("restaurant", (data) => {
    
        let imageSrc = 'data:image/jpeg;base64,' + data.buffer;
        let restaurant = { id: counter, name: data.name, rating: data.rating, uri: imageSrc };
        console.log('Adding restaurant: ' + data.name + ' with ID: ' + counter);
        restaurants.push(restaurant);

      if (restaurants.length >= 10) {
        navigate("Swipe", {
          myPhotos: restaurants,
        }); 
      }

      counter += 1
    });

  }

  state = {
    location: "",
    userID: 0,
    key: 0,
  };

  render() {
    const { navigate } = this.props.navigation;
    const RaisedButton = (props) => <Button raised {...props} />;

    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
      
          }}
        >
          <Image
            style={styles.logo}
            source={require("../assets/upick_logo_v2.png")}
          />
          <ActivityIndicator size="large" color="#b4cd31" />
          <Text style={styles.waitingText}>Loading restaurants. . .</Text>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f2ee",
    alignItems: "center",
    justifyContent: "center",
  },
  waitingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  logo: {
    width: "70%",
    height: "70%",
    resizeMode: 'contain',
  },
});

export {restaurants};
