import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as Location from 'expo-location';
import socketIO from 'socket.io-client';


import Home from './src/WelcomeScreen'
import MainMenu from './src/MainMenu'
import host from './src/host'
import join from './src/join'
import Swipe from './src/Swipe'
import info from './src/info'

console.disableYellowBox = true;

const socket = socketIO('http://192.168.1.84:8000', {
  transports: ['websocket'], jsonp: false
});


const Navigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: { headerShown: false, }
  },
  MainMenu: {
    screen: MainMenu,
    navigationOptions: { headerShown: false, }
  },
  host: {
    screen: host,
    navigationOptions: { headerShown: false, }
  },
  join: {
    screen: join,
    navigationOptions: { headerShown: false, }
  },
  Swipe: {
    screen: Swipe,
    navigationOptions: { headerShown: false, }
  },
  info: {
    screen: info,
    navigationOptions: { headerShown: false, }
  }
})



const App = createAppContainer(Navigator);

export default App;

