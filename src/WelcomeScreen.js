import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import {connection, setConnectionFalse, setConnectionTrue} from "../store";

export default class WelcomeScreen extends React.Component {

  startConnTimeout() {
    const { navigate } = this.props.navigation;
    this.timeout = setTimeout(function() {
      console.log("Timer done, no response from the server!");
      navigate("ConnectionError");
      setConnectionFalse();
    }, 10000);
  }

  stopConnTimeout(){
    clearTimeout(this.timeout);
    this.timeout = 0;
  }

  componentDidMount() {
    if(connection === false) {
      console.log("Attempting to reconnect to server.");
      socket.connect();
    }
    else {
      console.log("Already connected to the server!");
    }
    this.startConnTimeout();
    socket.on("Server-Check", () => {
      this.stopConnTimeout();
      console.log("connection ack received");
      this.startConnTimeout();
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.screen}>
        <TouchableWithoutFeedback onPress={() => navigate("LoadingServer")}>
          <View style={{ flex: 1 }}>
            <LinearGradient
              colors={["#000000", "#202020"]}
              style={styles.container}
            >
              <Image
                style={styles.logo}
                source={require("../assets/upick_logo.png")}
              />
              <Text style={styles.welcomeText}>Tap to Begin</Text>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0FFF0",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  welcomeText: {
    fontWeight: "100",
    fontSize: 18,
    //fontFamily: "sans-serif-thin",
    color: "white",
    marginBottom: "20%",
    marginTop: "10%",
  },
  logo: {
    width: "65%",
    height: "65%",
  },
});
