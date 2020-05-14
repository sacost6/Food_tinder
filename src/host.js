import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import LinearGradient from 'expo-linear-gradient';
import socketIO from 'socket.io-client';


const socket = socketIO('http://127.0.0.1:8000', {
    transports: ['websocket'], jsonp: false
});



export default class host extends React.Component {



    // connect to the server and on connection, send a message indicating that this user is hosting a session
    //TODO: Handle receiving key from the server after connecting
    componentDidMount() {
        socket.connect();
        socket.on('connect', () => {
            console.log("Connected to socket server");
            socket.emit('Connected', 'hosting');
        });

    }


    render() {
        const { navigate } = this.props.navigation;
        const RaisedButton = props => <Button raised {...props} />;


        return (
            <View style={styles.screen}>
                <View style={styles.pane}>
                    <View style={styles.keyContainer}>
                        <Text style={styles.keyStyle}>
                            Session Key: afgy67b383f
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
                            colors: ['red', 'orange'],
                            start: { x: 0, y: 0.5 },
                            end: { x: 1, y: 0.5 },
                        }} />
                </View>
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
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#e3dcd7',
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