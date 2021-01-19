

import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from "react-native-vector-icons/FontAwesome";
import socket from "../store/socket";
import {userID} from "../store";
import * as Location from 'expo-location';

let lat, lng, key;
let location_message;
let mount = true;


export default class HostOptions extends React.Component {
    constructor(props)
    {
    super(props);
     mount = true;
    }
    state = {
        isEnabled: true,
        locationMissing: true,
        location: '',
        fontColor: 'white', 
        message: 'Select a location to search near'
      };

      async getLocation()  {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
        } else {
            let location = await Location.getLastKnownPositionAsync({});

            if(mount) {
                this.setState({
                    locationMissing: false
                });
            }
            lat = location.coords.latitude;
            lng = location.coords.longitude;
            

        
        }
      }

    componentDidMount() {
        const { navigate } = this.props.navigation;

        this.getLocation();


        socket.on("host-info", (data) => {
            key = data;
            navigate('Host');
        });
        socket.on("geoCode_response", (response) => {
            if(response.success) {
                lat = response.latitude;
                lng = response.longitude;
                location_message = 'near ' + this.state.location;
                socket.emit("host-req", {
                    hostID: socket.id
                });
            }
            else {

            }

        });
    }
    
    componentWillUnmount() {
        socket.off("geoCode_response");
        socket.off("host-info");
        mount = false;
    }

    handleText = (text) => {
        this.state.location = text;
    }


    render() {
        const LocationInput = (props) => <Input leftIcon {...props} />;
            const RaisedButton = (props) => <Button raised {...props} />;
            const IconButton = (props) => <Button icon {...props} />;

        let renderInputBar = () => {
            if(!this.state.isEnabled) {
                return(
                <LocationInput
                            inputContainerStyle={styles.input}
                            labelStyle={styles.inputLabel}
                            inputStyle={styles.inputStyle}
                            onChangeText={(text) => this.handleText(text)}
                            placeholder="Enter a location"
                            leftIcon={{ type: "font-awesome", name: "location-arrow", color: "#879826" }}
                            leftIconContainerStyle={styles.iconContainer}
                />);
            }
            else {
                return null;
            }
    
        }

        let renderButton = () =>  {
            if(this.state.isEnabled) {
                return this.state.locationMissing;
            }
            else {
                return false;
            }

        }

        const { navigate } = this.props.navigation;
        const toggleSwitch = () => {

            let newState = !this.state.isEnabled;
            this.setState({
                isEnabled: newState
            });

        };
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
                width: "100%", }}
            >

                <IconButton
                    containerStyle={{
                    marginRight: "auto",
                    marginTop: 20,
                    marginLeft: 10,
                    }}
                    type="clear"
                    title="Join"
                    icon={<Icon name="arrow-left" size={35} color="#b4cd31" />}
                    buttonStyle={styles.backButton}
                    titleStyle={{...styles.buttonText, color:'#8B8B8B', marginLeft: 3}}
                    onPress={() => navigate("Join")}
                 />
                 <View style={styles.pane}>
                    <Text style={styles.text2}> {this.state.message} </Text>
                    <View style={styles.optionsPane}>

                    <View style={styles.optionContainer}>
                        <Text style={styles.text}> Use my location </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "white" }}
                            thumbColor={this.state.isEnabled ? "#b4cd31" : "#f4f3f4"}
                            onValueChange={toggleSwitch}
                            value={this.state.isEnabled}
                            style={{ marginRight: '5%'}}
                        />
                    </View>
                    </View>
                </View>

                
                <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.bottom}>

                    <TouchableWithoutFeedback 
                        disabled={renderButton()}
                        onPress={() => {
                            if(this.state.isEnabled) {
                                // use current location
                                location_message = 'using your location';
                                socket.emit("host-req", {
                                    hostID: userID
                                });
                
                            }
                            else {
                                // use custom location
                                socket.emit("geoCode", this.state.location);
                                
                            }
                    }}>

                        <View  style={styles.mButton}>
                        <Text style={styles.buttonText}> Create Session </Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.customContainer}>
                        {renderInputBar()}
                    </View>
                </KeyboardAvoidingView>

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
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: "93%",
        height: "40%",
        alignItems: "center",
        justifyContent: "flex-start",
      },
    text: {
        color: 'white',
        fontSize: 15,
        marginLeft: 'auto'
    },
    text2: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
    optionContainer: {
        marginTop: '5%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        width: "90%",
        alignSelf: "center",
        borderStyle: "solid",
        overflow: "hidden",
        backgroundColor: "#3d3d3d",
        borderRadius: 15,
        borderColor: "white",
        borderBottomColor: "#3d3d3d",
    
      },
    iconContainer: {
        marginLeft: "5%",
        marginRight: '3%',
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
    customContainer: {
        marginTop: '3%'
    },
    bottom: {
        width: '100%',
        flex: 4,
    },
    top: {
        width: '100%',
        flex: 2,
    },
    mButton: {
        marginTop: 'auto',
        width: '86%',
        height: 70,
        borderRadius: 20,
        backgroundColor: '#262626',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center'
      },
    buttonText: {
        fontWeight: '100',
        //fontFamily: "sans-serif-thin",
        fontSize: 20,
        color: '#b4cd31'
    },
    optionsPane: {
        width: '90%',
        alignSelf: 'center',


    },
    backButton: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom: '5%'
      },
    pane: {
        backgroundColor: "rgba(185, 185, 185, 0.15)",
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 10,
        borderRadius: 22,
        width: "90%",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: 'center'
      },
});

export {lat, lng, location_message, key };