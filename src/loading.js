import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID, SessionKey } from "../store/index";

let restaurants = [];

export default class host extends React.Component {

  constructor(props) {

    super(props);

    socket.emit('get-restaurant', {UserID: userID, key: SessionKey});
    const { navigate } = this.props.navigation;
    socket.on("restaurant", (data) => {
    
        let imageSrc = 'data:image/jpeg;base64,' + data.buffer;
        let restaurant = { id: data.id, name: data.name, rating: data.rating, uri: imageSrc, pricing: data.pricing };
        console.log(data.id + '.) Adding restaurant: ' + data.name  );
        restaurants.push(restaurant);

      if (restaurants.length >= 10) {
        navigate("Swipe", {
          myPhotos: restaurants,
        }); 
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
