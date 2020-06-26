import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import socketIO from 'socket.io-client';

const socket = socketIO('http://127.0.0.1:8000', {
    transports: ['websocket'], jsonp: false
});

export default class WelcomeScreen extends React.Component {

    componentDidMount() {

        socket.connect();
        socket.on('connect', () => {
            console.log("Connected to socket server");
            // get userId from server 
            socket.on('userID', (data) => {
                this.state.userName = data;
                console.log("data is " + data);
            });
            socket.on('host-info', (key) => {
                console.log("the host key is " + key);
            });
        });

    }


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.screen}>

                <TouchableWithoutFeedback onPress={() => navigate('MainMenu')}>
                    <View style={{ flex: 1 }}>
                        <LinearGradient colors={['#4568dc', '#b06ab3']}
                            style={styles.container}>
                            <Image source={require('../assets/Logo_placeholder.png')} />
                            <Text style={styles.welcomeText}>
                                Tap to Begin
                        </Text>
                        </LinearGradient>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F0FFF0',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },

});