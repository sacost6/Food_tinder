import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import socket from '../store/socket'
import * as Location from 'expo-location';
<<<<<<< HEAD
// New import statements 
import { foodApp, host, guest } from './reducers';
import store from '../store/index'
import { SessionKey } from '../store/actionTypes';
=======
import Navigator from '../App.js'


>>>>>>> 21c64c1e6b0cd3471a630e552e0913bb307bde82

export default class host extends React.Component {
    constructor(props) {
        super(props);
        const navigate = this.props.navigation;
        socket.emit('host-req', 9);
<<<<<<< HEAD
        socket.on('host-info', key => {

            store.dispatch(SessionKey(key));
            console.log("key is " + store.getState());
        });

=======
        console.log("host-request sent");
        socket.on('host-info', data => {
            this.setState( {key: data});
            console.log("1) key is " + data) });
        socket.on('Start', () => {navigate('Swipe')});
>>>>>>> 21c64c1e6b0cd3471a630e552e0913bb307bde82
    }


    state = {
        location: '',
        userID: 0,
        key: 0
    }

    // async function to get location from the hosting client
    getLocation = () => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }

            let location = await Location.getCurrentPositionAsync({});
            this.setState({ location: location })
            console.log('latitude: ' + location.coords.latitude);
        })();
    }

    render() {
        const { navigate } = this.props.navigation;
        const RaisedButton = props => <Button raised {...props} />;


        return (
            <View style={styles.screen}>
                <LinearGradient colors={['#4568dc', '#b06ab3']}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%', width: '100%' }}>
                    <View style={styles.pane}>
                        <View style={styles.keyContainer}>
                            <Text style={styles.keyStyle}>
                                {this.state.key}
                            </Text>
                        </View>
                        <ActivityIndicator size='large' />
                        <Text style={styles.waitingText}>
                            Waiting for someone to join...
                    </Text>
                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Cancel"
                            onPress={() => navigate('MainMenu')}
                            ViewComponent={LinearGradient} // Don't forget this!
                            linearGradientProps={{
                                colors: ['#4568dc', '#b06ab3'],
                                start: { x: 0, y: 0.5 },
                                end: { x: 1, y: 0.5 },
                            }} />
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f7f2ee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyContainer: {
        backgroundColor: '#f7f2ee',
        width: '80%',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyStyle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    pane: {
        //backgroundColor: 'rgba(52, 52, 52, 0.2)',  transparent color
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: '93%',
        height: '35%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    waitingText: {
        fontSize: 12,
    },
    mButton: {
        width: 350,
        height: 55,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',

    }

});