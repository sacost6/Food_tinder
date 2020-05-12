import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';

export default function App() {
    const [enteredGoal, setEnteredGoal] = useState('');
    const [courseGouls, setCourseGoals] = useState([]);

    const goalInputHandler = (enteredText) => {
        setEnteredGoal(enteredText);
    };

    const addGoalHandler = () => {
        setCourseGoals(currentGoals => [...courseGouls, enteredGoal]);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="New Task"
                    style={styles.input}
                    onChangeText={goalInputHandler}
                    value={enteredGoal}

                />
                <Button
                    title="ADD"
                    onPress={addGoalHandler}
                />
            </View>
            <ScrollView>
                {courseGouls.map((goal) =>
                    <View style={styles.listItem}>
                        <Text key={goal}>{goal}</Text>
                    </View>)}
            </ScrollView>

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
    screen: {
        padding: 50
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        width: '80%',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10
    },
    listItem: {
        padding: 10,
        margin: 10,
        backgroundColor: '#ccc',
        borderColor: 'black',
        borderWidth: 1
    }
});
