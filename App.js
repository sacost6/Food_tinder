import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./src/WelcomeScreen";
import MainMenu from "./src/MainMenu";
import host from "./src/host";
import join from "./src/join";
import Swipe from "./src/Swipe";
import info from "./src/info";
import loading from "./src/loading";
import Chosen from "./src/Chosen";
import LoadingServer from "./src/LoadingServer";
import EndOfOptions from "./src/EndOfOptions";


console.disableYellowBox = true;



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="Host" component={host} />
        <Stack.Screen name="Join" component={join} />
        <Stack.Screen name="Swipe" component={Swipe} />
        <Stack.Screen name="Info" component={info} />
        <Stack.Screen name="Loading" component={loading} />
        <Stack.Screen name="Chosen" component={Chosen} />
        <Stack.Screen name="LoadingServer" component={LoadingServer} />
        <Stack.Screen name="EndOfOptions" component={EndOfOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;