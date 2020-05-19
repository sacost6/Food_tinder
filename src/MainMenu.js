import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default class MainMenu extends React.Component {



    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.screen}>
                <LinearGradient colors={['#4568dc', '#b06ab3']}
                    style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableWithoutFeedback onPress={() => navigate('host')}>
                        <View style={styles.create}>
                            <Text style={styles.textStyle}>Host</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => navigate('join')}>
                        <View style={styles.join}>
                            <Text style={styles.textStyle}>Join</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </LinearGradient>
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
        borderRadius: 25,
        height: '80%',
        width: '95%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.2)',
        marginBottom: 10
    },
    create: {
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 25,
        flex: 1,
        height: '80%',
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.2)'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    }




});