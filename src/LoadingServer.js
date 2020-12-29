import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { DotIndicator } from "react-native-indicators";





export default class LoadingServer extends React.Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    socket.emit("in-loading");
    socket.on("ready", () => {
      navigate("MainMenu");
    });
  }

  componentWillUnmount() {
    socket.off('ready');
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
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/upick_logo_v2.png")}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.indicatorContainer}>
              <DotIndicator count={4} size={19} color="#b4cd31" />
            </View>
            <Text style={styles.waitingText}>
              Connecting to the server. . .{" "}
            </Text>

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
  waitingText: {
    fontSize: 12,
    fontWeight: "100",
    color: "white",
    alignSelf: "center",    
    marginBottom: '4%'
  },
  logo: {
    //marginTop: 100,
    alignSelf: 'center',
    marginTop: 'auto',
    width: "45%",
    height: "45%",
    resizeMode: "cover",
  },
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
        
  },
  logoContainer:  {
    //backgroundColor: 'red',
    width:'100%',
    flex: 2,
  },
  indicatorContainer: {
    //backgroundColor: 'green',
    width: '100%',
    height: '10%'
  }

});

