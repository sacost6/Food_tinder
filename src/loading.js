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
import {
  userID,
  SessionKey,
  numRestaurants,
  first,
  offset,
} from "../store/index";
import { DotIndicator } from "react-native-indicators";

let restaurants = [];
let photo_counter = 0;

export default class host extends React.Component {
  state = {
    location: "",
    userID: 0,
    key: 0,
    timer: 25,
  };

  onBackPress = () => {
    console.log("blocking android back press");
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  }
  componentDidUpdate() {
    const { navigate } = this.props.navigation;

    if (this.state.timer === 1) {
      clearInterval(this.interval);
      navigate("MainMenu");
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    clearInterval(this.interval);
  }

  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    let names = [];

    socket.on("restaurant", (data) => {
      let imageSrc = "data:image/jpeg;base64," + data.buffer;
      let restaurant = {
        id: data.id,
        name: data.name,
        rating: data.rating,
        uri: imageSrc,
        pricing: data.pricing,
        lat: data.lat,
        lng: data.lng,
      };
      console.log(
        "Adding restaurant: " + data.name + " price level: " + data.pricing
      );
      if (restaurants.includes(restaurant)) {
        //do nothing
      } else {
        restaurants.push(restaurant);
        photo_counter = photo_counter + 1;
      }
    });
    socket.on("all_data_sent", (data) => {
      console.log(
        "All data received, navigating to Swipe with " +
          restaurants.length +
          "restaurants"
      );
      navigate("Swipe");
    });
  }

  render() {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
          }}
        >
          <Image
            style={styles.logo}
            source={require("../assets/upick_logo_v2.png")}
          />
          <View style={styles.container}>
            <DotIndicator count={4} size={19} color="#b4cd31" />
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
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    marginTop: 600,
    alignSelf: "center",
  },
  logo: {
    marginTop: 100,
    width: "70%",
    height: "70%",
    resizeMode: "contain",
    position: "absolute",
  },
  container: {
    marginTop: 200,
  },
});

export { restaurants, photo_counter };
