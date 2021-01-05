import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Clipboard,
  Share,
  BackHandler,
} from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID} from "../store/index";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  WaveIndicator,
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
} from "react-native-indicators";
import {lat, lng, location_message, key} from './HostOptions';

export default class host extends React.Component {
  onBackPress = () => {
    console.log("blocking android back press");
    return true;
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const { navigate } = this.props.navigation;
    if(key === undefined) {
      console.log("Your key is undefined");
      navigate('MainMenu');
    }
    socket.emit("host-location", {
      key: key,
      hostID: userID,
      latitude: lat,
      longitude: lng
    });

    socket.on("Start", () => {
      navigate("Loading");
    });

    socket.on("Done", () => {
      console.log("Created session in the server.");
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    socket.off('Start');
  }

  state = {
    location: "",
    userID: 0,
    key: key,
  };

  async onShare() {
    try {
      const result = await Share.share({
        message: this.state.key,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  cancelSesssion() {
    socket.emit("cancel-sess", this.state.key);
    const { navigate } = this.props.navigation;
   navigate("MainMenu");
  }

  render() {
    const { navigate } = this.props.navigation;
    const RaisedButton = (props) => <Button raised {...props} />;
    const KeyContainer = (props) => <Button standard {...props} />;

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
          locations={[0.5,0.8]}
        >
          <Text style={styles.locationStyle}>Hosting {location_message}</Text>
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
    />
            <DotIndicator color="#b4cd31" count={3} size={16} />
            <Text style={styles.waitingText}>
              Waiting for someone to join...
            </Text>
            <RaisedButton
              buttonStyle={styles.mButton}
              title="Cancel"
              titleStyle={styles.buttonText}
              onPress={() => this.cancelSesssion()}
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
    fontSize: 20,
    //fontFamily: "sans-serif-thin",
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
    justifyContent: "flex-start",
  },
  waitingText: {
    fontSize: 15,
    fontWeight: "100",
    color: "white",
    //fontFamily: "sans-serif-thin",
    marginBottom: 10,
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
    //fontFamily: "sans-serif-thin",
    fontWeight: "bold",
  },
  locationStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '100'
  }
});
