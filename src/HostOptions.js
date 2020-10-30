

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Switch, KeyboardAvoidingView } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button, Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import socketIO from 'socket.io-client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from "react-native-vector-icons/FontAwesome";
import socket from "../store/socket";


let lat, lng;
let current_crd;
let location_message;

function success(pos) {
    current_crd = pos.coords;
  }
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class HostOptions extends React.Component {
    

    state = {
        isEnabled: true,
        location: '',
        fontColor: 'white', 
        message: 'Select a location to search near'
      };

    

    componentDidMount() {
        const { navigate } = this.props.navigation;
        navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true, timeout: 5000});
        socket.on("geoCode_response", (response) => {
            if(response.success) {
                
                lat = response.latitude;
                lng = response.longitude;
                location_message = 'near ' + this.state.location;
                navigate("Host");
            }
            else {
                this.setState({
                    message: 'Unable to find location, try again'
                });
            }

        });
    }
    
    componentWillUnmount() {
        socket.off("geoCode_response");
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
              locations={[0.5,1]}
            >

                <KeyboardAwareScrollView style={styles.top}>
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
                    <Text style={styles.text2}> {this.state.message} </Text>
                    <View style={styles.optionsPane}>

                    <View style={styles.optionContainer}>
                        <Text style={styles.text}> Use current location </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#f4f3f4" }}
                            thumbColor={this.state.isEnabled ? "#b4cd31" : "#f4f3f4"}
                            onValueChange={toggleSwitch}
                            value={this.state.isEnabled}
                            style={{ marginRight: '5%'}}
                        />
                    </View>
                    </View>

                </KeyboardAwareScrollView>

                <View style={styles.bottom}>


                    <RaisedButton
                        containerStyle={styles.buttonContainer}
                        buttonStyle={styles.mButton}
                        title="Host"
                        titleStyle={styles.buttonText}
                        onPress={() => {
                            if(this.state.isEnabled) {
                                // use current location
                                lat = current_crd.latitude;
                                lng = current_crd.longitude;
                                location_message = 'using your location';
                                navigate('Host');

                            }
                            else {
                                // use custom location
                                socket.emit("geoCode", this.state.location);
                                
                            }
                        }}
                        ViewComponent={LinearGradient} // Don't forget this!
                        linearGradientProps={{
                            colors: ["#879826", "#bfcd31"],
                            start: { x: 0, y: 0.5 },
                            end: { x: 1, y: 0.5 },
                        }}
                    />
                    <View style={styles.customContainer}>
                        {renderInputBar()}
                    </View>
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
    container: {
        backgroundColor: "rgba(185, 185, 185, 0.15)",
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: "93%",
        height: "40%",
        alignItems: "center",
        justifyContent: "flex-start",
      },
    text: {marginBottom: 'auto',
        color: 'white',
        fontSize: 24,
        marginLeft: '5%'
    },
    text2: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
    },
    optionContainer: {
        marginTop: '7%',
        marginBottom: '4%',
        width: '100%',
        height: '30%',
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
        flex: 1,
    },
    top: {
        width: '100%',
        flex: 1,
    },
    mButton: {
        width: '100%',
        height: 50,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
      },
      buttonContainer: {
          width: '86%',
          marginTop: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
      },
      buttonText: {
        fontWeight: '100',
        //fontFamily: "sans-serif-thin",
        fontSize: 20,
      },
      optionsPane: {
          borderRadius: 15,
          width: '85%',
          alignSelf: 'center',
          marginTop: '3%',
          height: '50%',
      },
      backButton: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom: '5%'
      },
});

export {lat, lng, location_message };