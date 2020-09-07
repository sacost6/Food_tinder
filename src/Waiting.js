import React from "react";
import { StyleSheet, View, ActivityIndicator, Image } from "react-native";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { DotIndicator, BarIndicator } from "react-native-indicators";

export default class LoadingServer extends React.Component {
  constructor(props) {
    super(props);
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
          <View style={styles.container}>
            <BarIndicator count={10} size={100} color="#b4cd31" />
          </View>
          <Text style={styles.waitingText}>
            {" "}
            Waiting for other player to finish...{" "}
          </Text>
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
    fontSize: 18,
    fontWeight: "100",
    color: "white",
    marginBottom: 60,
    fontFamily: "sans-serif-thin",
  },
  logo: {
    marginTop: 100,
    width: "70%",
    height: "70%",
    resizeMode: "contain",
    position: "absolute",
  },
  container: { marginTop: 60, flex: 3 },
});
