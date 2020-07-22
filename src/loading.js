import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import socket from "../store/socket";
import { userID, Partner } from "../store/index";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export default class host extends React.Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
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
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <Image
            style={styles.logo}
            source={require("../assets/upick_logo.png")}
          />
          <ActivityIndicator size="large" color="#b4cd31" />
          <Text style={styles.waitingText}>Loading nearest options . . .</Text>
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
  keyContainer: {
    backgroundColor: "#3d3d3d",
    width: "80%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  keyStyle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
  },
  pane: {
    backgroundColor: "rgba(185, 185, 185, 0.15)",
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 25,
    width: "93%",
    height: "40%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  waitingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  mButton: {
    width: 285,
    height: 55,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: "65%",
    height: "65%",
  },
});
