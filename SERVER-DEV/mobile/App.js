/* 
 * THIS IS NOT THE MAIN CLIENT-SIDE PROGRAM THIS WAS WRITTEN TO TEST THE
 * BACK END/SERVER PORTION OF THE APPLICATION.
 */
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import FetchLocation from './src/FetchLocation';
import {socket } from ";."
import socketIO from 'socket.io-client';
import Inputs from './services/input';


export default class App extends Component {
  state = {
    userName: 0,
    latitude: 0.0,
    longitude: 0.0
  }

  handleCoordinate(lat, lon) {
    this.state.latitude = lat;
    this.state.longitude = lon;
  }

  componentDidMount() {
    socket.connect();
    socket.on('connect', () => {
      console.log("Connected to socket server");
      // get userId from server 
      socket.on('userID', (data) => {
        this.state.userName = data;
      });
  
    });
    // Get user location on boot up and send to user
    navigator.geolocation.getCurrentPosition(position => {

      this.state.latitude = position.coords.latitude;
      this.state.longitude = position.coords.longitude;
      socket.emit('latitude', position.coords.latitude);
      socket.emit('longitude', position.coords.longitude);
    }, err => console.log(err));

  }

  render() {
    return (
      <View style={styles.container}>
        <FetchLocation onGetLocation={() => {
          socket.emit('get-restaurant', this.state.userName)
        }} />
        <Button title="Become Host" onPress={() => {
          console.log("dude wanna be the host fse")
          socket.emit('host-req', this.state.userName);
        }} />
        <Button title="Join a session" onPress={() => {
          console.log("pussy boy wanna join");
          socket.emit('session-req', { key: '307772', userID: this.state.userName });
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: 'white'
  }
});
