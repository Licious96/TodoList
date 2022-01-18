import React,{ useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { Text, View, Button, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AddTask from './screens/AddTask';
import HomeStack from './screens/HomeStack';

const Stack = createStackNavigator();

export default function App() {

  const setId = Date.now()

  useEffect(async()=> {
    const userId = await AsyncStorage.getItem('@userId')
    const parsedId = JSON.parse(userId)
    if (!parsedId) {
      await AsyncStorage.setItem('@userId', JSON.stringify(setId))
    }
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="TodoList" component={HomeStack} options={{headerShown: false}}/>
          <Stack.Screen name="AddTask" component={AddTask} options={{title: "Add task",}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}
