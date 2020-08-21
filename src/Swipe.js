import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  PanResponder,

} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID} from "../store/index";
import { restaurants, photos } from './loading';
import {Rating} from 'react-native-elements';
import { color } from "react-native-reanimated";

let SCREEN_HEIGHT;
SCREEN_HEIGHT = Dimensions.get("window").height;
let SCREEN_WIDTH;
SCREEN_WIDTH = Dimensions.get("window").width;
let counter = 0;

/*Restaurants = [
  { id: "1", uri: photos[0], restName: "Burger King" },
  { id: "2", uri: photos[1], restName: "McDonald's" },
  { id: "3", uri: photos[2], restName: "PizzaHut" },
  { id: "4", uri: photos[3], restName: "Domino's"},
  { id: "5", uri: photos[4], restName: "????"}
];*/ 

export default class Swipe extends React.Component {

state = {
    refArray: [],
};

dollar_image = require('../assets/dollar.png');

  componentDidMount() {

  }

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
    };
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    });
    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate,
        },
        ...this.position.getTranslateTransform(),
      ],
    };
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp",
    });
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp",
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp",
    });
  }

  // method is functional but no longer recommended.
  //TODO: update method
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },

      // method called when the user releases the the card
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 1, y: gestureState.dy },
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
          console.log("done updating state");
          socket.emit("yes", {key: SessionKey, userID: userID, rest: restaurants[counter].name});
          counter = counter + 1;
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 1, y: gestureState.dy },
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });
          console.log("done updating state");
          socket.emit("no", {key: SessionKey, userID: userID, rest: restaurants[counter].name});
          counter = counter + 1;
        } else if (
            Math.abs(gestureState.dy < 6) && Math.abs(gestureState.dx) < 6
        ) {
    
          this.props.navigation.navigate("info");
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
          }).start();
        }
      },
    });
  }


  renderPrice = (price) => {
    if(price === 0) {
      return null;
    }
    else if(price === 1) {
      return (
        <View style={{flex: 1, marginLeft: 15, justifyContent: 'flex-start', marginTop: 10}}>
        <Image style={styles.pricing} source={require('../assets/dollar.png')}>
      
        </Image>
        
        </View>
      );
    }
    else if(price === 2) {
      return (
        <View style ={{flex: 1, marginLeft: 15, backgroundColor: '', justifyContent: 'flex-start', flexDirection: 'row'}}>
          <Image style={styles.pricing} source={require('../assets/dollar.png')}>
          </Image>
          <Image style={styles.pricing} source={require('../assets/dollar.png')}>
          </Image>
        </View>
      );
    }
    else{
      return (
        <View style ={{flexDirection: 'row'}}>
        <Image source={require('../assets/dollar.png')}>

        </Image>
        <Image source={require('../assets/dollar.png')}>

        </Image>
        <Image source={require('../assets/dollar.png')}>

        </Image>
        </View>
      );
    }


  }

  renderRestaurants = () => {

    
    return restaurants.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null;
      } else if (i === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[this.rotateAndTranslate, styles.animatedStyle]}
          >
          <LinearGradient colors={["#000000", "#202020"]} style={{flex: 1, borderRadius: 20, borderWidth: 2, borderColor: '#b4cd31'}}>

            <Animated.View
              style={{
                opacity: this.likeOpacity,
                transform: [{ rotate: "-30deg" }],
                position: "absolute",
                top: 50,
                left: 40,
                zIndex: 1000,
              
              }}
            >
              <Text style={styles.likeStyle}>YES</Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: this.dislikeOpacity,
                transform: [{ rotate: "30deg" }],
                position: "absolute",
                top: 50,
                right: 40,
                zIndex: 1000,
              
              }}
            >
              <Text style={styles.dislikeStyle}>NOPE</Text>
              
            </Animated.View>
            
            
            <Image style={styles.imageStyle} source={{uri: item.uri}} borderRadius={0}/>
            <View style={styles.infoCard}>
              
                <Text style={styles.Name}> {item.name} </Text>
                
              
               <Rating
                  readonly
                  onFinishRating={this.ratingCompleted}
                  ratingCount={5}
                  startingValue={item.rating}
                  style={{ paddingVertical: 0, alignSelf: 'flex-start', paddingLeft: 20 }}
                  tintColor='rgba(0,0,0,.9)'
                  imageSize={17}
                />

                {this.renderPrice(item.pricing)}
                
                
               
            </View>
            
            </LinearGradient>

          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[
              {
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: "absolute",
                
              },
            ]}
          >
            <LinearGradient colors={["#000000", "#202020"]} style={{flex: 1, borderRadius: 20, borderWidth: 2, borderColor: '#b4cd31'}}>

            <Image style={styles.imageStyle} source={{uri: item.uri}} borderRadius={20}/>
            <View style={styles.infoCard}>
              <Text style={styles.Name}> {item.name} </Text>



            </View>

            </LinearGradient>

          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#000000", "#202020"]} style={{flex: 1}}>
          <View style={{height: 60 }}/>

         <View style={{flex: 1 }}>{this.renderRestaurants()}
      
          </View>
          

          <View style={{height: 60}}/>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animatedStyle: {
    height: SCREEN_HEIGHT - 120,
    width: SCREEN_WIDTH,
    padding: 10,
    position: "absolute",
    borderRadius: 20,
    overflow: 'hidden',

  },
  imageStyle: {
    height: 400,
    width: 388,
    resizeMode: "contain",
    flex: 2,
    borderRadius: 6
  },
  likeStyle: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
  },
  dislikeStyle: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
  },
  Name: {
    color: 'white',
    fontSize: 28,
    fontWeight: '100',
    paddingBottom: 5
  },
  infoCard: {
      flex: 1,
      marginLeft: 13,
      borderRadius: 20,
      
  },
  Rating: {
    color: 'white',
    fontWeight: '100'
  },
  pricing: {
    
    width: 25,
    height: 25,
    resizeMode: 'contain',
    

    
  }
});

