import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";

export default class MainMenu extends React.Component {
  componentDidMount() {
    this.props.navigation.addListener("beforeRemove", (e) => {
      // Prevent default behavior of leaving the screen
      console.log("preventing back in 2");
      e.preventDefault();
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableWithoutFeedback onPress={() => navigate("Host")}>
            <View style={styles.create}>
              <Text style={styles.textStyle}>Host</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => navigate("Join")}>
            <View style={styles.join}>
              <Text style={styles.textStyle}>Join</Text>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#B22222",
  },
  join: {
    borderRadius: 25,
    height: "80%",
    width: "95%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(100, 100, 100, 0.30)",
    marginBottom: 10,
  },
  create: {
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 25,
    flex: 1,
    height: "80%",
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 100, 100, 0.30)",
  },
  textStyle: {
    color: "white",
    fontWeight: "100",
    fontSize: 30,
    fontFamily: "sans-serif-thin",
  },
});
