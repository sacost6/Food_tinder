import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import socket from '../store/socket';

export default class join extends React.Component {
    constructor(props) {
        super(props);
        const {navigate} = this.props.navigation;
        socket.on('Start', () => navigate('Swipe'));
    }


    state = {
        // updated whenever the KeyInput field is updated
        sesskey: ''
    }



    render() {
        const KeyInput = props => <Input leftIcon {...props} />;
        const RaisedButton = props => <Button raised {...props} />;
        const {navigate} = this.props.navigation; 
        return (
            <View style={styles.screen}>
                <LinearGradient colors={['#000000', '#202020']}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%', width: '100%' }} >
                    <View style={styles.pane}>
                        <KeyInput inputContainerStyle={styles.input}
                            labelStyle={styles.inputLabel}
                            onChangeText={text => {
                                this.state.sesskey = text
                                console.log('sessKey updated to: ' + this.state.sesskey);
                            }}
                            placeholder='Enter session key'
                            leftIcon={{ type: 'font-awesome', name: 'key', color: '#879826' }}
                            leftIconContainerStyle={styles.iconContainer} />

                        <RaisedButton
                            buttonStyle={styles.mButton}
                            title="Join"
<<<<<<< HEAD
                            titleStyle= {styles.buttonText}
                            onPress={() => 
                                //console.log(this.state.sesskey);
                                //socket.emit('session-req', { key: this.state.sesskey, userID: 4 })
                                navigate('Swipe')
                            }
=======
                            onPress={() => {
                                console.log(this.state.sesskey);
                                socket.emit('session-req', { key: this.state.sesskey, userID: 4 });
                            }}
>>>>>>> 5792fd6746165383e69b42391111278e6d856b13
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
        position: 'relative',
        backgroundColor: '#C733FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        borderStyle: 'solid',
        overflow: 'hidden',
        backgroundColor: '#3d3d3d',
        borderRadius: 25,
        borderBottomColor: '#3d3d3d'

    },
    pane: {
       
        backgroundColor: 'rgba(185, 185, 185, 0.15)', 
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '35%',
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

    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    iconContainer: {
        marginLeft: '10%'
    },
    inputLabel: {
        color: 'black',
        fontWeight: 'bold'
    }
});