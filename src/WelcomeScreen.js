import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';

export default class WelcomeScreen extends React.Component {


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.screen}>
                <TouchableWithoutFeedback onPress={() => navigate('MainMenu')}>
                    <View style={styles.container}>
                        <Image source={require('../assets/Logo_placeholder.png')} />
                        <Text style={styles.welcomeText}>
                            Tap to Begin
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#B22222',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        padding: 100,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    welcomeText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },

});