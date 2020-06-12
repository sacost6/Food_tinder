import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import socketIO from 'socket.io-client';
import * as Location from 'expo-location';


const socket = socketIO('http://127.0.0.1:8000', {
    transports: ['websocket'], jsonp: false
});



export default class host extends React.Component {


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


    // connect to the server and on connection, send a message indicating that this user is hosting a session
    // send location 
    //TODO: Handle receiving key from the server after connecting
    componentDidMount() {

        this.getLocation();
        socket.connect();
        console.log('Connection status: ' + socket.connected);
        socket.on('connect', () => {
            console.log("Connected to socket server");
            socket.emit('Connected', 'hosting');

            socket.on('userID', (ID) => {
                this.setState({ userID: ID })
                console.log('Received user ID: ' + this.state.userID);
                socket.emit('host-req', this.state.userID);
            });
            socket.on('host-info', (key) => {
                this.setState({ key: key })
                console.log('Received session key: ' + this.state.key);

            });
        });

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