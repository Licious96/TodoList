import 'react-native-gesture-handler';
import React,{ useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import AddTask from './screens/AddTask';
import HomeStack from './screens/HomeStack';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//App banner ca-app-pub-3106841701777643/3700789908
//App interstitial ca-app-pub-3106841701777643/3944332484

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