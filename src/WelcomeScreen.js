import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default class WelcomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.screen}>
        <TouchableWithoutFeedback onPress={() => navigate("MainMenu")}>
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
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    marginBottom: "20%",
    marginTop: "10%",
  },
  logo: {
    width: "65%",
    height: "65%",
  },
});
