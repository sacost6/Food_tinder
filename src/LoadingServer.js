import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { DotIndicator } from "react-native-indicators";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  let crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude: ${crd.latitude}`);
  socket.emit("coordinates", { lat: crd.latitude, lon: crd.longitude });
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class LoadingServer extends React.Component {
  constructor(props) {
    super(props);
    let counter = 0;
    const { navigate } = this.props.navigation;
    navigator.geolocation.getCurrentPosition(success, error, options);
    socket.on("ready", () => {
      navigate("MainMenu");
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
              Connecting to the server. . .{" "}
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
    fontWeight: "400",
    color: "white",
    position: "absolute",
    marginTop: 600,
  },
  logo: {
    marginTop: 100,
    width: "70%",
    height: "70%",
    resizeMode: "contain",
    position: "absolute",
  },
  container: { marginTop: 200 },
});
