import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import socketIO from 'socket.io-client';



export default class info extends React.Component {

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
                <Text> DISPLAY DETAILED RESTAURANT INFO HERE</Text>
            </View>
        );
    }
    
}

const styles = StyleSheet.create({

});