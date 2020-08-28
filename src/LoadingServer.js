import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket  from "../store/socket"

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    let crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude: ${crd.latitude}`);
    socket.emit("coordinates", {lat: crd.latitude, lon: crd.longitude});
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class LoadingServer extends React.Component {
    constructor(props) {
        super(props);
        let counter = 0;
        const {navigate} = this.props.navigation;
        navigator.geolocation.getCurrentPosition(success, error, options);
        socket.on("ready", () =>{
           navigate("MainMenu");
        });
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
                    <Image
                        style={styles.logo}
                        source={require("../assets/upick_logo_v2.png")}
                    />
                    <ActivityIndicator size="large" color="#b4cd31" />
                    <Text style={styles.waitingText}>CONNECTING TO SERVER. . . </Text>
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
        fontWeight: "bold",
        color: "white",
    },
    logo: {
        width: "70%",
        height: "70%",
        resizeMode: 'contain',
    },
});