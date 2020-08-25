import { Provider } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as Location from "expo-location";
import socketIO from "socket.io-client";
import { registerRootComponent } from "expo";

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

const Navigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: { headerShown: false },
  },
  MainMenu: {
    screen: MainMenu,
    navigationOptions: { headerShown: false },
  },
  host: {
    screen: host,
    navigationOptions: { headerShown: false },
  },
  join: {
    screen: join,
    navigationOptions: { headerShown: false },
  },
  Swipe: {
    screen: Swipe,
    navigationOptions: { headerShown: false },
  },
  info: {
    screen: info,
    navigationOptions: { headerShown: false },
  },
  loading: {
    screen: loading,
    navigationOptions: { headerShown: false },
  },
  Chosen: {
    screen: Chosen,
    navigationOptions: { headerShown: false},
  },
  LoadingServer: {
    screen: LoadingServer,
    navigationOptions: {headerShown: false},
  },
  EndOfOptions: {
    screen: EndOfOptions,
    navigationOptions: {headerShown: false},
  }
});

const App = createAppContainer(Navigator);

export default App;
