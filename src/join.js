import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { SessionKey, userID } from "../store/index";
import Icon from "react-native-vector-icons/FontAwesome";
import { WaveIndicator } from "react-native-indicators";
import { Text } from "react-native-elements";

export default class join extends React.Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    socket.on("Start", () => {
      socket.emit("get-restaurant", {
        UserID: userID,
        key: SessionKey,
        offset: 0,
      });
      navigate("Loading");
    });
  }

  state = {
    // updated whenever the KeyInput field is updated
    sesskey: "",
  };

  render() {
    const KeyInput = (props) => <Input leftIcon {...props} />;
    const RaisedButton = (props) => <Button raised {...props} />;
    const IconButton = (props) => <Button icon {...props} />;

    const { navigate } = this.props.navigation;
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <IconButton
            containerStyle={{
              marginRight: "auto",
              marginTop: 50,
              marginLeft: 10,
            }}
            type="clear"
            icon={<Icon name="arrow-left" size={35} color="#b4cd31" />}
            buttonStyle={styles.backButton}
            titleStyle={styles.buttonText}
            onPress={() => navigate("MainMenu")}
          />
          <View style={styles.pane}>
            <KeyInput
              inputContainerStyle={styles.input}
              labelStyle={styles.inputLabel}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => {
                this.state.sesskey = text;
              }}
              placeholder="Enter session key"
              leftIcon={{ type: "font-awesome", name: "key", color: "#879826" }}
              leftIconContainerStyle={styles.iconContainer}
            />

            <RaisedButton
              containerStyle={{ marginTop: "auto" }}
              buttonStyle={styles.mButton}
              title="Join"
              titleStyle={styles.buttonText}
              onPress={() => {
                this.SessionKey = this.state.sesskey;
                console.log(this.state.sesskey);
                socket.emit("session-req", {
                  key: this.state.sesskey,
                  userID: userID,
                });
              }}
              ViewComponent={LinearGradient} // Don't forget this!
              linearGradientProps={{
                colors: ["#879826", "#bfcd31"],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "#C733FF",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    alignSelf: "center",
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: "#3d3d3d",
    borderRadius: 25,
    borderColor: "white",
    borderBottomColor: "#3d3d3d",
  },
  pane: {
    backgroundColor: "rgba(185, 185, 185, 0.15)",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "40%",
    width: "90%",
    borderRadius: 25,
    marginBottom: 250,
  },
  mButton: {
    width: 230,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontFamily: "sans-serif-thin",
    fontSize: 20,
  },
  iconContainer: {
    marginLeft: "10%",
  },
  inputLabel: {
    color: "black",
    fontWeight: "bold",
  },
  inputStyle: {
    color: "white",
    fontFamily: "sans-serif-thin",
    fontWeight: "bold",
  },
  backButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});
