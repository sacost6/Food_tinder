import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Button, Input} from "react-native-elements";
import socket from "../store/socket";
import { userID, SessionKey, numRestaurants, first, offset} from "../store/index";
import io from "socket.io-client";
import {goBack} from "@react-navigation/routers/src/CommonActions";
import {connTimeout} from "../store/index";

export default class ConnectionError extends React.Component {
    constructor(props) {
        super(props);
        let counter = 0;
        const { navigate } = this.props.navigation;
    }

    onBackPress = () => {
        console.log("blocking android back press");
        return true;
    };


    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    render() {
        const RaisedButton = (props) => <Button raised {...props} />;
        const { navigate } = this.props.navigation;
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
                        <Image
                            style={styles.logo}
                            source={require("../assets/sad_cloud.png")}
                        />
                        <Text style={styles.endText}>Your connection has been interrupted.</Text>
                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Attempt to Reconnect"
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                if(socket.connected === true) {
                                    connTimeout.startTimeout();
                                    this.props.navigation.goBack();
                                }
                                else {
                                    // TODO: Add some sort of toast or message to user telling they are not connected yet
                                    console.log("Not connected to the server!");
                                    socket.connect();
                                }
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
        width: "100%",
        borderStyle: "solid",
        overflow: "hidden",
        backgroundColor: "#3d3d3d",
        borderRadius: 25,
        borderBottomColor: "#3d3d3d",
    },
    pane: {

        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        height: "35%",
        width: "90%",
        position: "absolute",
        borderRadius: 25,
    },
    mButton: {
        width: 250,
        height: 55,
        borderRadius: 25,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    buttonText: {
        fontWeight: "100",
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
        color: 'white'
    },
    endText: {
        marginTop: 10,
        color: 'white',
        textAlign: 'center',
        fontWeight: '100',
        fontSize: 17,
        marginBottom: 100

    },
    logo: {
        width: "65%",
        height: "65%",
    },
});