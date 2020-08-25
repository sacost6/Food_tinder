import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID, SessionKey, numRestaurants, first, offset} from "../store/index";

let restaurants = [];

export default class host extends React.Component {

    constructor(props) {
    super(props);
    let counter = 0;
    const { navigate } = this.props.navigation;
    socket.emit('get-restaurant', {UserID: userID, key: SessionKey, offset: 0});
    socket.on("restaurant", (data) => {
        let imageSrc = 'data:image/jpeg;base64,' + data.buffer;
        let restaurant = { id: counter, name: data.name, rating: data.rating, uri: imageSrc, pricing: data.pricing };
        console.log('Adding restaurant: ' + data.name + ' price level: ' + data.pricing);
        if(restaurants.includes(restaurant)) {
            //do nothing
        }
        else {
            restaurants.push(restaurant);
            counter = counter + 1;
            console.log("Current key for restaurant is: " + counter);
        }
      if (restaurants.length >= numRestaurants) {
        navigate("Swipe");
      }
    });
  }

  state = {
    location: "",
    userID: 0,
    key: 0,
  };

  render() {
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
