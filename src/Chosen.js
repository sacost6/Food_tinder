import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, Dimensions, Linking} from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import socket from "../store/socket";
import { userID, SessionKey } from "../store/index";
import {rest_name} from "./Swipe";
import Icon from 'react-native-vector-icons/FontAwesome';



const IconButton = (props) => <Button icon {...props} />;
let SCREEN_HEIGHT;
SCREEN_HEIGHT = Dimensions.get("window").height;
let SCREEN_WIDTH;
SCREEN_WIDTH = Dimensions.get("window").width;

export default class Chosen extends React.Component {
    constructor(props) {
        super(props);
        
    }

    openMaps() {
        const lat = 41.867780
        const lng = -87.883790
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url); 








    }



    
    render() {
        return (
            <View style={styles.screen}>
                <LinearGradient
                    colors={["#000000", "#202020"]}
                    style={{
                        alignItems: "center",
                        justifyContent: "flex-end",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <Image style={styles.match} source={require('../assets/match_3.png')}>
                    </Image>

                    
                    <Text style={styles.resName}> {rest_name} </Text>
                    

                    <View style={styles.bottomContainer}>
                        <IconButton
                            containerStyle={{alignSelf: 'flex-end', marginTop: 'auto', marginBottom: 15, marginRight: 15}}
                            buttonStyle={styles.button}
                            icon={
                                <Icon
                                 name="map"
                                 size={35}
                                 color="black"
                                />
                            }
                            onPress={() => this.openMaps()}
                            
        
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
    match: {
        width: "120%",
        height: "120%",
        resizeMode: 'contain',
        flex: 2,
        marginTop: 100
        
    },
    resName: {
        color: 'white',
        marginTop: 50,
        fontSize: 25,
        fontWeight: 'bold',
        
    },
    button: {
        borderRadius: 50,
        width: 100,
        height: 100,
        paddingTop: 10,
        backgroundColor: '#b4cd31'
    },
    topContainer: {
        width: '100%',
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50,
        backgroundColor: 'red'
    },
    bottomContainer: {
        width: '100%',
        flex: 1,
        }
    
});
