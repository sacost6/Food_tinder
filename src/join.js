import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  ActivityIndicator,
  Text
} from "react-native";
import { Input, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { SessionKey, userID } from "../store/index";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


export default class join extends React.Component {
  constructor(props) {
    super(props);
  }

 
 
  componentDidMount() {
 
    const { navigate } = this.props.navigation;
    socket.on("Start", () => {
      socket.emit("get-restaurant", {
        userID: userID,
        key: SessionKey,
        offset: 0,
      });
      navigate("Loading");
    });
  }

  componentWillUnmount() {
    socket.off("Start");
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
            title="Host"
            
            icon={<Icon name="arrow-left" size={35} color="#b4cd31" />}
            buttonStyle={styles.backButton}
            titleStyle={{...styles.buttonText, color: "#8B8B8B", marginLeft: 3}}
            onPress={() => navigate("HostOptions")}
          />
          <View style={styles.pane}>
            <KeyInput
              inputContainerStyle={styles.input}
              autoCapitalize = 'none'
              labelStyle={styles.inputLabel}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => {
                this.state.sesskey = text;
              }}
              placeholder="Enter session key"
              leftIcon={{ type: "font-awesome", name: "key", color: "#879826" }}
              leftIconContainerStyle={styles.iconContainer}
            />
            
            <TouchableWithoutFeedback onPress={() => {
                this.SessionKey = this.state.sesskey;
                console.log(this.state.sesskey);
                socket.emit("session-req", {
                  key: this.state.sesskey.toLowerCase(),
                  userID: userID,
                });
              }}>

                <View  style={styles.mButton}>
                  <Text style={styles.buttonText}> Join </Text>
                </View>
            </TouchableWithoutFeedback>
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
    borderRadius: 20,
    borderColor: "white",
    borderBottomColor: "#3d3d3d",

  },
  pane: {
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "46%",
    width: "95%",
    borderRadius: 20,

    marginBottom: 200,
  },
  mButton: {
    width: 230,
    height: 60,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#262626'

  },
  buttonText: {
    fontWeight: "bold",
    //fontFamily: "sans-serif-thin",
    fontSize: 20,
    color: '#b4cd31'
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
    //fontFamily: "sans-serif-thin",
    fontWeight: "bold",
  },
  backButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});
