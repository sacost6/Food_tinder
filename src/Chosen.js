import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import socket from "../store/socket";
import { userID, SessionKey } from "../store/index";
import {rest_name} from "./Swipe";

export default class Chosen extends React.Component {
    constructor(props) {
        super(props);
    }
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
                    <ActivityIndicator size="large" color="#b4cd31" />
                    <Text style={styles.waitingText}>{rest_name}</Text>
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
