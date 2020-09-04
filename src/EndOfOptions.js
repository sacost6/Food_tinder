import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Button, Input} from "react-native-elements";
import socket from "../store/socket";
import { userID, SessionKey, numRestaurants, first, offset} from "../store/index";

let restaurants = [];

export default class EndOfOptions extends React.Component {

    constructor(props) {
        super(props);
        let counter = 0;
        const { navigate } = this.props.navigation;
    }

    state = {
        location: "",
        userID: 0,
        key: 0,
    };

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
                        <Text style={styles.endText}>You have gone through all the options!</Text>
                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Main Menu"
                            titleStyle={styles.buttonText}
                            onPress={() => {
                                navigate("MainMenu");
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
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontWeight: "bold",
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
        marginTop: 60,
        color: 'white',
        textAlign: 'center',
        fontWeight: '100',
        fontSize: 15
    }
});

export {restaurants};
