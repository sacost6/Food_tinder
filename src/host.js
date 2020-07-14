import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import socket from '../store/socket'
import * as Location from 'expo-location';

// New import statements 
import { foodApp, host, guest } from './reducers';
import store from '../store/index'
import { SessionKey } from '../store/actionTypes';


export default class host extends React.Component {
    constructor(props) {
        super(props);
        const {navigate} = this.props.navigation;
        socket.emit('host-req', 9);
        socket.on('host-info', key => {

            store.dispatch(SessionKey(key));
            console.log("key is " + store.getState());
        });

        console.log("host-request sent");
        socket.on('host-info', data => {
            this.setState( {key: data});
            console.log("1) key is " + data) });
        socket.on('Start', () => {navigate('Swipe')});
 
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
                <LinearGradient colors={['#000000', '#202020']}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%', width: '100%' }}>
                    <View style={styles.pane}>
                        <View style={styles.keyContainer}>
                            <Text style={styles.keyStyle}>
                                {this.state.key}
                            </Text>
                        </View>
                        <ActivityIndicator size='large'
                            color='#b4cd31'
                        />
                        <Text style={styles.waitingText}>
                            Waiting for someone to join...
                    </Text>
                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Cancel"
                            titleStyle={styles.buttonText}
                            onPress={() => navigate('MainMenu')}
                            ViewComponent={LinearGradient} // Don't forget this!
                            linearGradientProps={{
                                colors: ['#879826', '#bfcd31'],
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
        backgroundColor: '#3d3d3d',
        width: '80%',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyStyle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
    pane: {
        backgroundColor: 'rgba(185, 185, 185, 0.15)',  
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 25,
        width: '93%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    waitingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white'
    },
    mButton: {
        width: 285,
        height: 55,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
    

});