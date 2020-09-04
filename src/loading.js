import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image, BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID, SessionKey, numRestaurants, first, offset} from "../store/index";

let restaurants = [];

export default class host extends React.Component {

  state = {
    location: "",
    userID: 0,
    key: 0,
    timer: 60
  };

  onBackPress = () => {
    console.log("blocking android back press");
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress );
    this.interval = setInterval(
      () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
      1000
    );
  }
  componentDidUpdate(){
    const {navigate} = this.props.navigation;

    if(this.state.timer === 1){ 

      clearInterval(this.interval);
      navigate("MainMenu");
    }
  }
  
  componentWillUnmount(){
   BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
   clearInterval(this.interval);
  }






    constructor(props) {
    
    super(props);
    let counter = 0;
    const { navigate } = this.props.navigation;
    





    socket.emit('get-restaurant', {UserID: userID, key: SessionKey, offset: 0});
    socket.on("restaurant", (data) => {

        let imageSrc = 'data:image/jpeg;base64,' + data.buffer;
        let restaurant = { id: data.id, name: data.name, rating: data.rating, uri: imageSrc, pricing: data.pricing, lat: data.lat, lng: data.lng };
        console.log('Adding restaurant: ' + data.name + ' price level: ' + data.pricing);
        if(restaurants.includes(restaurant)) {
            //do nothing
        }
        else {
            restaurants.push(restaurant);
            counter = counter + 1;
        }

    });
    socket.on("all_data_sent", (data) => { 
        console.log("All data received, navigating to Swipe with " + restaurants.length + "restaurants");
        navigate('Swipe');
    });
    socket.on("Retry", () => {
      socket('get-restaurant', {UserID: userID, key: SessionKey, offset: 0});
    });



  }

  

  render() {
    return (
      <View style={styles.screen}>
        <LinearGradient
          colors={["#000000", "#202020"]}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
      
          }}
        >
          <Image
            style={styles.logo}
            source={require("../assets/upick_logo_v2.png")}
          />
          <ActivityIndicator size="large" color="#b4cd31" />
          <Text style={styles.waitingText}>Searching for restaurants. . .</Text>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f2ee",
    alignItems: "center",
    justifyContent: "center",
  },
  waitingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  logo: {
    width: "70%",
    height: "70%",
    resizeMode: 'contain',
  },
});

export {restaurants};
