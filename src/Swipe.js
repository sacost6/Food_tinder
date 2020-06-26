import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

SCREEN_HEIGHT = Dimensions.get('window').height
SCREEN_WIDTH = Dimensions.get('window').width

Restaurants = [
    { id: "1", uri: require('../assets/burger_king_logo.png') },
    { id: "2", uri: require('../assets/mcdonalds_logo.png') },
    { id: "3", uri: require('../assets/pizza_logo.png') },
    { id: "4", uri: require('../assets/dominos_logo.png') },
]




export default class Swipe extends React.Component {


    constructor() {
        super()

        this.position = new Animated.ValueXY()
        this.state = {
            currentIndex: 0
        }
        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        })
        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        }
        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        })
        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        })
        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })
        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })

    }


    // method is functional but no longer recommended. 
    //TODO: update method 
    UNSAFE_componentWillMount() {


        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },

            // method called when the user releases the the card
            onPanResponderRelease: (evt, gestureState) => {

                if (gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 1, y: gestureState.dy }
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                    console.log('done updating state');
                }
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 1, y: gestureState.dy }
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                    console.log('done updating state');
                }
                else if (Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy < 6)) {

                    this.props.navigation.navigate('info');

                }
                else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }

            }

        })
    }



    renderRestaurants = () => {


        return Restaurants.map((item, i) => {
            if (i < this.state.currentIndex) {
                return null
            }
            else if (i == this.state.currentIndex) {
                console.log('rendering next card');
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id}
                        style={[this.rotateAndTranslate, styles.animatedStyle]}>


                        <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={styles.likeStyle}>YES</Text>
                        </Animated.View>
                        <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={styles.dislikeStyle}>NOPE</Text>
                        </Animated.View>


                        <Image style={styles.imageStyle}
                            source={item.uri}>
                        </Image>
                    </Animated.View>
                )
            }
            else {
                return (
                    <Animated.View

                        key={item.id}
                        style={[{
                            opacity: this.nextCardOpacity,
                            transform: [{ scale: this.nextCardScale }],
                            height: SCREEN_HEIGHT - 120,
                            width: SCREEN_WIDTH,
                            padding: 10,
                            position: 'absolute',
                        }]}>

                        <Image style={styles.imageStyle}
                            source={item.uri}>
                        </Image>
                    </Animated.View>
                )
            }



        }).reverse()
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <LinearGradient colors={['#4568dc', '#b06ab3']}
                    style={{ flex: 1 }}>
                    <View style={{ height: 60 }}>
                    </View>

                    <View style={{ flex: 1 }}>
                        {this.renderRestaurants()}
                    </View>

                    <View style={{ height: 60 }}>
                    </View>
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
        position: 'absolute',
    },
    imageStyle: {
        height: null,
        width: null,
        resizeMode: 'cover',
        flex: 1,
        backgroundColor: '#d9d7d6',
        borderRadius: 20,
    },
    likeStyle: {
        borderWidth: 1,
        borderColor: 'green',
        color: 'green',
        fontSize: 32,
        fontWeight: 'bold',
        padding: 10
    },
    dislikeStyle: {
        borderWidth: 1,
        borderColor: 'red',
        color: 'red',
        fontSize: 32,
        fontWeight: 'bold',
        padding: 10
    }
});