import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';


export default class MainMenu extends React.Component {



    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.screen}>
                <TouchableWithoutFeedback onPress={() => navigate('host')}>
                    <View style={styles.join}>
                        <Text style={styles.textStyle}>Create a new Session</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => navigate('join')}>
                    <View style={styles.create}>
                        <Text style={styles.textStyle}>Host a session</Text>
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
    },
    join: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a62e28',
    },
    create: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B22222',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    }




});