import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {
  const [outputText, setOutputText] = useState('Hello World!');
  return (
    <View style={{padding: 70}}>

      <View style={{flexDirection: 'row', justifyContent : 'space-between', alignItems : 'center' }}> 
        <TextInput placeholder="New Task"
         style={{width : '80%', borderBottomColor:'black', borderBottomWidth: 1, padding : 10}}/>
        <Button title="ADD"/>
      </View>

      <View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
