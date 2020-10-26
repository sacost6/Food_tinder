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

export default class loading extends React.Component {
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
    const { navigate } = this.props.navigation;
    restaurants = [];
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );

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
      console.log("NUMBER OF RESTAURANTS::: " + restaurants.length);
      navigate("Swipe");
    });
  }

  componentDidUpdate() {
    const { navigate } = this.props.navigation;

    if (this.state.timer === 1) {
      clearInterval(this.interval);
      console.log("GOING TO MAIN MENU FROM LOADING WITH TIMER");
      navigate("MainMenu");
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    clearInterval(this.interval);
    socket.off("all_data_sent");
    socket.off("restaurant");
  }

  constructor(props) {
    super(props);

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

export { restaurants, photo_counter };
