import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TodoScreen from './TodoScreen'
import DoneScreen from './DoneScreen';

const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: '#fff',
                    justifyContent: 'space-evenly',
                    borderRadius: 40,
                    bottom: 5,
                    marginHorizontal: 20
                }
            }}>
            <Tab.Screen
                name="Home"
                component={TodoScreen}
                options={{
                    title: "Todo List",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 30,
                        fontFamily: 'Roboto',
                        color: '#1B5790',
                    },
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#f2f2f2',
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name="format-list-bulleted" size={25} color={focused ? '#448aff' : '#448aaf'} />
                    ),
                }}
            />
            <Tab.Screen
                name="Done"
                component={DoneScreen}
                options={{
                    title: "Completed Tasks",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 30,
                        fontFamily: 'Roboto',
                        color: '#1B5790',
                    },
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#f2f2f2',
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name="playlist-check" size={25} color={focused ? '#448aff' : '#448aaf'} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default HomeStack
