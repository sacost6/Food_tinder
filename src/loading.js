import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";

import { DotIndicator } from "react-native-indicators";

let restaurants = [];
let token;
let isMounted = false;

export default class loading extends React.Component {
  state = {
    location: "",
    userID: 0,
    key: 0,
  };

  constructor(props) {
    super(props);
    token = 0;
  }

  onBackPress = () => {
    console.log("blocking android back press");
    return true;
  };

  componentDidMount() {
    isMounted = true;
    const { navigate } = this.props.navigation;
    restaurants = [];
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.startTimer(navigate);
    socket.on("restaurant", (data) => {


      let image_sources = data.buffer;
      for (let i = 0; i<image_sources.length; i++) {
        image_sources[i].source = "data:image/jpeg;base64," + image_sources[i].source;

      }
      let restaurant = {
        id: data.id,
        name: data.name,
        rating: data.rating,
        images: image_sources,
        pricing: data.pricing,
        lat: data.lat,
        lng: data.lng,
        place_id: data.place_id,
        num_ratings: data.num_ratings
      };

      if (restaurants.includes(restaurant)) {
        //do nothing
      } else {
        restaurants.push(restaurant);
      }


    });
    socket.on("all_data_sent", (data) => {
      console.log(
        "All data received, navigating to Swipe with " +
          restaurants.length +
          "restaurants"
      );
      token = data;
      this.stopTimer();
      navigate("Swipe");
    });
    socket.on("dis_from", () => {
      console.log("in loading, disconnecting....")
      socket.disconnect();
    });
    
    socket.on("partner-disconnected", (key) => {
      socket.emit("cancel-sess", key);
      this.stopTimer();
      socket.off("all_data_sent");
      socket.off("restaurant");
      console.log("partner_disconnected fired in loading.js");
      navigate("Disconnected");
    });
  }

  startTimer(navigate) {
    this.timeout = setTimeout(function(){
          if(isMounted) {
          console.log("In timer function, navigating to home");
          navigate("Home");
          console.log("Timer done!"); }
        },
        35000
    );
  }

  stopTimer() {
    console.log("Timer has been cleared")
    clearTimeout(this.timeout);
    this.timeout = 0;
  }

  componentWillUnmount() {
    isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    this.stopTimer();
    socket.off("all_data_sent");
    socket.off("restaurant");
  }
  

  render() {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
          }}
        >
          <View style={styles.imageContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/upick_logo_v2.png")}
          />
          </View>
          <View style={styles.container}>
            <View style={{width: '100%', height: '10%', marginTop: '3%'}}>
            <DotIndicator count={4} size={19} color="#b4cd31"  />
            </View>
            <Text style={styles.waitingText}>
              Searching for restaurants. . .
            </Text>
          </View>
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
    marginBottom: '3%',
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  logo: {
    width: "45%",
    height: "45%",
    resizeMode: "cover",
    position: "absolute",
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    width: '100%'
  },
  imageContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  }
});

export { restaurants, token };
