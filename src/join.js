import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import LinearGradient from 'expo-linear-gradient';

export default class join extends React.Component {




    render() {
        const KeyInput = props => <Input leftIcon {...props} />;
        const RaisedButton = props => <Button raised {...props} />;
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.screen}>
                <View style={styles.pane}>
                    <KeyInput inputContainerStyle={styles.input} placeholder='Enter session key'
                        leftIcon={{ type: 'font-awesome', name: 'key' }} />

                    <RaisedButton
                        buttonStyle={styles.mButton}
                        title="Join"
                        onPress={() => navigate('Swipe')}
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
    input: {
        borderStyle: 'solid',
        overflow: 'hidden',
        backgroundColor: '#f2f0ee',
        borderRadius: 25,
        borderBottomColor: '#d1cdca',

    },
    pane: {
        backgroundColor: '#e3dcd7',
        padding: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '35%',
        width: '93%',
        borderRadius: 20,
    },
    mButton: {
        width: 350,
        height: 55,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',

    }

});