import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  Linking,
  BackHandler,
} from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import socket from "../store/socket";
import { userID, SessionKey } from "../store/index";
import { rest_name, location } from "./Swipe";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

const IconButton = (props) => <Button icon {...props} />;
let SCREEN_HEIGHT;
SCREEN_HEIGHT = Dimensions.get("window").height;
let SCREEN_WIDTH;
SCREEN_WIDTH = Dimensions.get("window").width;

function Chosen(props) {
  useFocusEffect(
    /*this.props.navigation.addListener("beforeRemove", (e) => {
      // Prevent default behavior of leaving the screen

      if (e.data === "Swipe") {
        console.log("preventing a back to the Swipe screen");
        e.preventDefault();
      } else {
        console.log("Allowing event of target: " + e.data);
      }
    }); */
    React.useCallback(() => {
      const onBackPress = () => {
        console.log("blocking android back press");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  function openMaps() {
    const lat = location.lat;
    const lng = location.lon;
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#000000", "#202020"]}
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          height: "100%",
          width: "100%",
        }}
      >
        <Image
          style={styles.match}
          source={require("../assets/match_3.png")}
        ></Image>
        <View style={styles.textContainer}>
          <Text style={styles.resName}>
            {" "}
            {"You both chose " + rest_name + "!"}{" "}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <IconButton
            containerStyle={{
              alignSelf: "flex-end",
              marginTop: "auto",
              marginBottom: 15,
              marginLeft: 15,
            }}
            buttonStyle={styles.mapButton}
            icon={<Icon name="map" size={35} color="black" />}
            onPress={() => openMaps()}
          />

          <IconButton
            containerStyle={{
              alignSelf: "flex-end",
              marginBottom: 15,
              marginLeft: "auto",
              marginRight: 15,
            }}
            buttonStyle={styles.homeButton}
            icon={<Icon name="home" size={35} color="black" />}
            onPress={() => props.navigation.navigate("MainMenu")}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f2ee",
    alignItems: "center",
    justifyContent: "center",
  },
  match: {
    width: "120%",
    height: "120%",
    resizeMode: "contain",
    flex: 2,
    marginTop: 100,
  },
  resName: {
    color: "white",
    marginTop: 50,
    fontSize: 25,
    fontWeight: "100",
    textAlign: "center",
  },
  mapButton: {
    borderRadius: 50,
    width: 80,
    height: 80,
    paddingTop: 10,
    backgroundColor: "#b4cd31",
  },
  topContainer: {
    width: "100%",
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
    backgroundColor: "red",
  },
  bottomContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  homeButton: {
    borderRadius: 50,
    width: 80,
    height: 80,
    paddingTop: 10,
    backgroundColor: "#b4cd31",
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Chosen;
