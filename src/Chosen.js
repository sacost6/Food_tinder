import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Linking,
  BackHandler,
} from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { rest_name, location, phone, website, noWebsite, noPhone} from "./Swipe";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "react-native-elements";

const IconButton = (props) => <Button icon {...props}
raised={true}
 />;
const WebButton = (props) => <Button icon {...props}
raised={true}
disabled={noWebsite}
/>;
const PhoneButton = (props) => <Button icon {...props}
raised={true}
disabled={noPhone}
/>;

const PillButton = (props) => <Button icon {...props}
type="outline"
title="Home"
titleStyle={styles.buttonText} />;

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

  function callRestaurant() {
    Linking.openURL(`tel:${phone}`);
  }
  function openWebsite() {
    let url = website
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
}

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
            buttonStyle={styles.clearButton}
            icon={<Icon name="map" size={25} color="white" />}
            onPress={() => openMaps()}
          />

          <IconButton
            containerStyle={{
              alignSelf: "flex-end",
              marginBottom: 15,
              marginLeft: "auto",
              marginRight: 15,
            }}
            buttonStyle={styles.clearButton}
            icon={<Icon name="home" size={30} color="white" />}
            onPress={() => {
              props.navigation.navigate("WelcomeScreen")
            }
            }
          />
          <PhoneButton
            containerStyle={{
              alignSelf: "flex-end",
              marginBottom: 15,
              marginLeft: "auto",
              marginRight: 15,
            }}
            buttonStyle={styles.clearButton}
            icon={<Icon name="phone" size={30} color="white" />}
            onPress={() => callRestaurant()
            }
          />
          <WebButton
            containerStyle={{
              alignSelf: "flex-end",
              marginBottom: 15,
              marginLeft: "auto",
              marginRight: 15,
            }}
            title="www"
          
            titleStyle={{fontSize:17, color:'white'}}
            buttonStyle={styles.webButton}
            onPress={() => openWebsite()
            }
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
    //fontFamily: "sans-serif-thin",
    textAlign: "center",
  },
  mapButton: {
    borderRadius: 50,
    width: 55,
    height: 55,
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
  clearButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    paddingTop: 10,
    backgroundColor: '#262626',
    borderColor: 'red'
    
  },
  webButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    paddingTop: 10,
    backgroundColor: '#262626',
    justifyContent: 'flex-end',
    borderColor:'green'
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  pillButton: {
    width: '40%',
    height: '40%',
    borderRadius: 13,
    borderColor: "#b4cd31",
    borderWidth: 1,
    backgroundColor: '#262626'
  
  },
  buttonText: {
    color: 'white',
    marginLeft: '20%'
  },
  iconContainerStyle: {
    marginRight: 19
  }
});

export default Chosen;