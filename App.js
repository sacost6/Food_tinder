import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './src/WelcomeScreen'
import MainMenu from './src/MainMenu'
import host from './src/host'
import join from './src/join'
import Swipe from './src/Swipe'


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
  }
})

const App = createAppContainer(Navigator);

export default App;




