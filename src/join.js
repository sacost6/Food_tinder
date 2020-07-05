import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import socket from '../store/socket';

export default class join extends React.Component {


    state = {
        // updated whenever the KeyInput field is updated
        sesskey: ''
    }



    render() {
        const KeyInput = props => <Input leftIcon {...props} />;
        const RaisedButton = props => <Button raised {...props} />;
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.screen}>
                <LinearGradient colors={['#4568dc', '#b06ab3']}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%', width: '100%' }} >
                    <View style={styles.pane}>
                        <KeyInput inputContainerStyle={styles.input}
                            onChangeText={text => {
                                this.state.sesskey = text
                                console.log('sessKey updated to: ' + this.state.sesskey);
                            }}
                            placeholder='Enter session key'
                            leftIcon={{ type: 'font-awesome', name: 'key' }} />

                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Join"
                            onPress={() => {
                                console.log(this.state.sesskey);
                                socket.emit('session-req', { key: this.state.sesskey, userID: 4 });
                            }}
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
        position: 'relative',
        backgroundColor: '#C733FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        borderStyle: 'solid',
        overflow: 'hidden',
        backgroundColor: '#f2f0ee',
        borderRadius: 25,
        borderBottomColor: '#FFFFFF',

    },
    pane: {
        //backgroundColor: 'rgba(52, 52, 52, 0.2)', transparent color
        backgroundColor: '#FFFFFF',
        padding: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '30%',
        width: '90%',
        position: 'absolute',
        borderRadius: 25,
    },
    mButton: {
        width: 250,
        height: 55,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',

    }

});