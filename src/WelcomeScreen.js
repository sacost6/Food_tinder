import React from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import Svg, {Image, Circle, ClipPath} from "react-native-svg";
import { Text } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {Easing} from "react-native-reanimated";
import {TapGestureHandler, State} from "react-native-gesture-handler";
import socket from "../store/socket";
import { useNavigation } from '@react-navigation/native';
import {connection, setConnectionFalse, setConnectionTrue} from "../store";


const{width,height} = Dimensions.get("window");
const {Value,
   event,
    block,
     cond,
      eq,
       set,
        Clock,
         startClock,
          stopClock,
           timing,
            debug,
             clockRunning,
              interpolate,
               Extrapolate,
                concat  } = Animated

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('Hello World', stopClock(clock))),
    state.position
  ]);

}

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.buttonOpacity = new Value(1);
    this.onStateChange = event([
      {
        nativeEvent:({state})=>block([
          cond(eq(state, State.END), set(this.buttonOpacity, 
            runTiming(new Clock(), 1, 0)))
        ])
      }
    ])

    this.onCloseState = event([
      {
        nativeEvent:({state})=>block([
          cond(eq(state, State.END), set(this.buttonOpacity, 
            runTiming(new Clock(), 0, 1)))
        ])
      }
    ])


    this.bgY = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[-height / 3,0],
      extrapolate: Extrapolate.CLAMP
    
    })


    this.menuButtonZindex = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[1,-1],
      extrapolate: Extrapolate.CLAMP
    
    })

    this.menuButtonY = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[0,100],
      extrapolate: Extrapolate.CLAMP
    
    })

    this.menuButtonOpacity = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[1,0],
      extrapolate: Extrapolate.CLAMP
    
    })

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[180,360],
      extrapolate: Extrapolate.CLAMP
    })



  }

  componentDidMount() {
    if(socket.connected === false) {
      console.log("In Welcome screen, socket is not connected to server");
      console.log("Attempting to reconnect...");
      socket.connect();
      if(socket.connected) {
        console.log("Reconnect attempt succesful!");
      }
      else {
        console.log("Reconnect attempt unsuccesful");
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.screen}>
        <TapGestureHandler onHandlerStateChange={this.onStateChange}>
        <Animated.View style={{...StyleSheet.absoluteFill, transform:[{translateY: this.bgY}]}} >
            <View style={{ flex: 1 }}>
              <LinearGradient
                colors={["#000000", "#202020"]}
                style={styles.container}
              >

                <Svg height={height+15} width={width+width/2}>

                  <ClipPath id='clip'>
                    <Circle r={height} cx={width/2}/>
                  </ClipPath>
                  <Image
                      width={"100%"}
                      height={height+ height/2}
                      href={require("../assets/upick_logo.png")}
                      preserveAspectRatio="xMidyMid meet"
                       
                  />
                </Svg>

                  <Animated.View style={{...styles.textContainer, opacity: this.buttonOpacity}}>
                    <Text style={styles.welcomeText}>Tap to Begin</Text>


                  </Animated.View>
              </LinearGradient>
            </View>
        </Animated.View>
        </TapGestureHandler>

      
        <View style={{height: height/3 , justifyContent: 'center' }} >


          <Animated.View style={{height: height/3,
             ...StyleSheet.absoluteFill, top:null,
              justifyContent: "center", zIndex:this.menuButtonZindex,
               opacity: this.menuButtonOpacity,
              transform:[{translateY: this.menuButtonY}]}}
          >

            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text style={{fontSize:15, color: 'white', transform:[{rotate: concat(this.rotateCross, 'deg')}]}} >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>


            <TouchableWithoutFeedback onPress={() =>  {
              if(socket.connected) {
              navigate("HostOptions"); }
              else {socket.connect();}
            }}>
                <Animated.View style={styles.button}>
                  <Text style={{color: '#b4cd31'}}> HOST </Text>
                </Animated.View>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => {
              if(socket.connected)  {
                navigate("Join")
              } 
              else {socket.connect();}
          }}

            >
                <Animated.View style={styles.button}>
                  <Text style={{color: 'white'}}> JOIN </Text>
                </Animated.View>
            </TouchableWithoutFeedback>

          </Animated.View>



        </View>




      </View>

    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#383838',
    justifyContent: 'flex-end'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  welcomeText: {
    fontWeight: "100",
    fontSize: 18,
    //fontFamily: "sans-serif-thin",
    color: "white",
    marginBottom: "20%",
    marginTop: "10%",
  },
  logo: {
    width: "65%",
    height: "65%",
  },
  button: {
    borderRadius: 35,
    marginHorizontal: 20,
    height: 70,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowOffset: {height: 2, width: 2},
    shadowColor: 'black',
    shadowOpacity: 0.3,
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: '#303030',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2-20,
    shadowOffset: {height: 2, width: 2},
    shadowColor: 'black',
    shadowOpacity: 0.3,
    borderColor: 'white'
  }
});
