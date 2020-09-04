import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Clipboard, Share } from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID } from "../store/index";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class host extends React.Component {
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    socket.emit("host-req", userID);
    socket.on("host-info", (data) => {
      console.log("1( the host key is " + data);
      console.log("**userID is " + userID);
      this.setState({ key: data });
    });
    console.log("host-request sent");
    socket.on("Start", () => {
      navigate("Loading");
    });
  }

  state = {
    location: "",
    userID: 0,
    key: 0,
  };

  async onShare(){
    try {
      const result = await Share.share({
        message:
        this.state.key,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          console.log("key shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("share prompt dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  }


  render() {
    const { navigate } = this.props.navigation;
    const RaisedButton = (props) => <Button raised {...props} />;
    const KeyContainer = (props) => <Button standard {...props} />;
    

    copyToClipboard = (key) => {
      Clipboard.setString(key);

    }

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
          <View style={styles.pane}>
            
            <KeyContainer 
              buttonStyle={styles.keyContainerStyle}
              onPress={() => this.onShare()}
              title={"Key: " + this.state.key}
              titleStyle={styles.keyStyle}
              icon={
                <Icon
                  name="share-alt"
                  type="font-awesome"
                  size={15}
                  color="#b4cd31"
                />
              }
              iconContainerStyle={styles.iconContainer}
              >
            </KeyContainer>
            <ActivityIndicator size="large" color="#b4cd31" />
            <Text style={styles.waitingText}>
              Waiting for someone to join...
            </Text>
            <RaisedButton
              buttonStyle={styles.mButton}
              title="Cancel"
              titleStyle={styles.buttonText}
              onPress={() => navigate("MainMenu")}
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
    backgroundColor: "#f7f2ee",
    alignItems: "center",
    justifyContent: "center",
  },
  keyContainerStyle: {
    
    backgroundColor: "#3d3d3d",
    width: 300,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  keyStyle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
    paddingLeft: 10,
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
});
