import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import socket from "../store/socket";
import { userID, numRestaurants, SessionKey } from "../store/index";
import { restaurants, token } from "./loading";
import { Rating } from "react-native-elements";
import {Root, Toast} from "popup-ui";
import PaginationDot from 'react-native-animated-pagination-dot'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linking } from "react-native";

let total_num_restaurants;

let SCREEN_HEIGHT;
SCREEN_HEIGHT = Dimensions.get("window").height;
let SCREEN_WIDTH;
SCREEN_WIDTH = Dimensions.get("window").width;
let counter = 0;
let rest_name = "n/a";
let phone;
let website;
let location = { lat: 0.0, lon: 0.0 };
let noPhone = false;
let noWebsite = false;

export default class Swipe extends React.Component {
  state = {
    refArray: [],
  };

  dollar_image = require("../assets/dollar.png");

  componentDidMount() {
    counter = 0;
    rest_name = "n/a";
    total_num_restaurants = restaurants.length;
    const { navigate } = this.props.navigation;
    // TODO: 
    // move to constructor???

    this._unsubscribe = this.props.navigation.addListener(
      "beforeRemove",
      (e) => {
        // Prevent default behavior of leaving the screen
        console.log("preventing back from swipe");
        e.preventDefault();
      }
    );

    socket.on("partner-disconnected", (key) => {
      socket.emit("cancel-sess", key);
      this._unsubscribe();
      navigate("Disconnected");
    });
    socket.on("found the one", (data) => {
      console.log("Chosen restaurant is " + data.rest.name);
      rest_name = data.rest.name;
      website = data.website;
      phone = data.phone;
      location.lat = data.rest.lat;
      location.lon = data.rest.lng;
      socket.removeEventListener("partner-disconnected");
      this._unsubscribe();


      if(phone===0) {
        noPhone = true;
      }
      if(website=== 'none') {
        noWebsite = true;
      }
      
      navigate("Chosen");
    });
    socket.on("both_out_options", () => {
      this._unsubscribe();
      navigate("EndOfOptions");
    });
    socket.on("1 player done", () => {
      //TODO inform player they must wait
      console.log("This player is done but the other is not");
      Toast.show({
        title: 'User created',
        text: 'Your user was successfully created, use the app now.',
        color: '#2ecc71'
    });
    });
    socket.on("page2_restaurant", (data) => {

      let image_sources = data.buffer;
      for (let i = 0; i<image_sources.length; i++) {
        image_sources[i] = "data:image/jpeg;base64," + image_sources[i];
      }
      let restaurant = {
        id: data.id,
        name: data.name,
        rating: data.rating,
        images: image_sources,
        pricing: data.pricing,
        lat: data.lat,
        lng: data.lng,
        place_id: data.place_id,
        num_ratings: data.num_ratings
      };

  
      restaurants.push(restaurant);
      total_num_restaurants = total_num_restaurants + 1;
      console.log("received a page 2 restaurant: " + data.name);

      
    });

  }

  componentWillUnmount() {
    socket.off("player");
    socket.off("both_out_options");
    socket.off("found the one");
    socket.off("partner-disconnected");
    socket.off("page2_restaurant");
    this._unsubscribe();

  }

  constructor(props) {
    super(props);
    

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      photoIndex: 0,
      underPhotoIndex: 0
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
        const { navigate } = this.props.navigation;
        if (gestureState.dx > 120) {

          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1, photoIndex: 0 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });

       
          socket.emit("yes", {
            key: SessionKey,
            userID: userID,
            rest: restaurants[counter],
          });
          counter = counter + 1;
          console.log("Counter: " + counter);
          console.log("total number of restaurants: " + total_num_restaurants)
          if (counter === total_num_restaurants - 5) {
            console.log("Sending request for next page");
            this.getNextPage(SessionKey);
          }
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1, photoIndex: 0 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            });
          });

      
          socket.emit("no", {
            key: SessionKey,
            userID: userID,
            rest: restaurants[counter].name,
          });
          counter = counter + 1;
          console.log("Counter: " + counter);
          console.log("total number of restaurants: " + total_num_restaurants)
          if (counter === total_num_restaurants - 5) {
            console.log("Sending request for next page");
            this.getNextPage(SessionKey);
          }
        } else if (
          Math.abs(gestureState.dy < 6) &&
          Math.abs(gestureState.dx) < 6
        ) {

          
          if(gestureState.x0 < SCREEN_WIDTH/2) {
            console.log("left tap");
            this.imageTapHandler(-1, this.state.currentIndex, this.state.photoIndex);
          }
          else {
            console.log("Right tap");
            this.imageTapHandler(1, this.state.currentIndex, this.state.photoIndex);
          }


        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }


  getNextPage(SessKey) {
    socket.emit("nextPage", {
    SessionKey: SessKey,
    nextPageToken: token
  });
  }

  renderRating = (rating) => {
    rating = Math.round(rating);
    if(Number.isNaN(rating)) {
      return null;
    }
    if (rating === 0) {
      return null;
    } else if (rating === 1) {
      return (
        <View style={styles.ratingContainer} >
          <Image
            style={styles.pricing}
            source={require("../assets/star.png")}
          ></Image>
        </View>
      );
    } else if (rating === 2) {
      return (
        <View style={styles.ratingContainer}>
          <Image
            style={styles.pricing}
            source={require("../assets/star.png")}
          ></Image>
          <Image
            style={styles.pricing}
            source={require("../assets/star.png")}
          ></Image>
        </View>
      );
    } else if(rating === 3) {
      return (
        <View style={styles.ratingContainer}>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
        </View>
      );
    }
    else if(rating === 4) {
      return(
        <View style={styles.ratingContainer}>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
        </View>

      );

    }
    else if(rating === 5) {
      return(
        <View style={styles.ratingContainer}>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
          <Image style={styles.pricing} source={require("../assets/star.png")}></Image>
        </View>

      );

    }
    
    
  };

  // Uses regex to extract html link from html attribute
  getHref(href_string) {
    return href_string.match(/href="([^"]*)/)[1];

  }
  getName(href_string) {
    return href_string.match(/\>(.*?)\</)[1];
  }

  // Uses regex to extract the source name from html attribute
  getHrefName = (href_string, item) => {
    if(href_string === null) {
      return null;
    }else {
    console.log("In getHrefName with href_string: " + href_string);
    var source_name;
    try {
      source_name = href_string.match(/\[(.*?)\]/)[1];
      console.log("was not null!");

    } catch (error) {
      console.log("was null!")

    }
  
      return (
        <View>
        <Text style={styles.attributionText}> Photo Listing by: 
            <Text
              style={{color: 'blue'}}
              onPress={() => Linking.openURL(this.getHref(item.images[this.state.photoIndex].attribution[0]))}> 
              <Text> </Text> {this.getName(item.images[this.state.photoIndex].attribution[0])}
            </Text> 
        </Text>
        </View>
      );
    
      }
    
  };


  imageTapHandler(tap, index, photoIndex) {
    let num_images = restaurants[index].images.length;
    console.log("numbr of images: " + num_images);
    console.log("PhotoIndex passed to imageTapHandler: " + photoIndex);
    let newIndex;
    if(photoIndex+tap < 0) {
      newIndex = 0;
    }
    else if (photoIndex+tap > num_images-1) {
      newIndex = num_images-1;
    } 
    else {
      newIndex = photoIndex + tap;
    }
    this.setState({
      photoIndex: newIndex
    });

    console.log("photo_index: " + photoIndex);
    
  }


  renderStar() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Image style={styles.pricing} source={require("../assets/star2.png")}></Image>
      </View>
    );
  }



  renderAttribution = (attribution) => {
    



  };

  renderPrice = (price) => {
    if (price === 0) {
      return null;
    } else if (price === 1) {
      return (
        <View
          style={{
            marginLeft: 10,
            justifyContent: "flex-start",
            marginTop: 10,
          }}
        >
          <Image
            style={styles.pricing}
            source={require("../assets/dollar.png")}
          ></Image>
        </View>
      );
    } else if (price === 2) {
      return (
        <View
          style={{
            marginLeft: 10,
            backgroundColor: "",
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          <Image
            style={styles.pricing}
            source={require("../assets/dollar.png")}
          ></Image>
          <Image
            style={styles.pricing}
            source={require("../assets/dollar.png")}
          ></Image>
        </View>
      );
    } else if (price === 3) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
        </View>
      );

    }
    else if (price === 4) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
        </View>
      );
      
    }
    else if (price === 5) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
          <Image source={require("../assets/dollar.png")}></Image>
        </View>
      );
      
    }
  };

  renderRestaurants = () => {
    return restaurants
      .map((item, i) => {
        if (i < this.state.currentIndex) {
          return null;
        } else if (i === this.state.currentIndex) {
          console.log("photoIndex: " + this.state.photoIndex);
           return(
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id}
              style={[this.rotateAndTranslate, styles.animatedStyle]}
            >
              <LinearGradient
                colors={["#000000", "#202020"]}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#b4cd31",
                }}
              >
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


                <Image
                  style={styles.imageStyle}
                  source={{ uri: item.images[this.state.photoIndex].source }}
                  borderRadius={0}
                />
                <View style={{alignItems: 'center', marginTop: 10,}}>
                  <PaginationDot 
                    activeDotColor={"white"} 
                    curPage={this.state.photoIndex} 
                    maxPage={item.images.length}
                    sizeRatio={1.0}
                    style={{alignItems: 'center'}}
                />
                
                </View>
                <View style={styles.infoCard}>

                  <View style={styles.titlePane}>
                  <Text style={styles.Name}> {item.name} </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {this.renderPrice(item.pricing)}
                    {this.renderRating(item.rating)}
                  </View>
                  <View style={styles.attributionPane}> 
                    {this.getHrefName(item.images[this.state.photoIndex].attribution[0], item)}  
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        } else if (i === this.state.currentIndex + 1) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
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
              <LinearGradient
                colors={["#000000", "#202020"]}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#b4cd31",
                }}
              >



                <Image
                  style={styles.imageStyle}
                  source={{ uri: item.images[this.state.underPhotoIndex].source }}
                  borderRadius={20}
                />
                <View style={{alignItems: 'center', marginTop: 10,}}>
                  <PaginationDot 
                    activeDotColor={"white"} 
                    curPage={0} 
                    maxPage={item.images.length}
                    sizeRatio={1.0}
                    style={{alignItems: 'center'}}
                  />
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.Name}> {item.name} </Text>
                  {this.renderPrice(item.pricing)}
                  {this.renderRating(item.rating)}

                </View>
              </LinearGradient>
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  render() {
    return (
      <Root>
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#000000", "#202020"]} style={{ flex: 1 }}>
          <View style={{ height: 60 }} />
          <Image source={require("../assets/powered_by_google.png")}
            style={{marginLeft: 15, color: 'white'}}></Image>

          <View style={{ flex: 1 }}>{this.renderRestaurants()}</View>
          <View style={{ height: 60 }} />
        </LinearGradient>
      </View>
      </Root>
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
    overflow: "hidden",
    
  },
  imageStyle: {
    marginTop: 10,
    height: 400,
    width: '100%',
    resizeMode: "contain",
    flex: 5,
    borderRadius: 6,
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
    color: "white",
    fontSize: 25,
    fontWeight: "100",
    paddingBottom: 5,
  },
  infoCard: {
    paddingTop: 10,
    paddingLeft: 5,
    flex: 2,
    marginLeft: 5,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 10,
  
  },
  titlePane: {
    borderRadius: 10,
  },
  Rating: {
    color: "white",
    fontWeight: "100",
  },
  pricing: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  ratingContainer: {
    marginLeft: 10,
    justifyContent: "flex-start",
    marginTop: 0,
    flexDirection: "row",
  },
  photoIndexStyle: {
    backgroundColor: 'green',
    color: 'red',
    width: '100%',

    flex: 1
  },
  attributionText: {
    color: 'white'
  },
  attributionPane: {

  }

  
});

export { rest_name, location, phone, website, noWebsite, noPhone };

// flex 3 and 3
// flex 3 and 4
