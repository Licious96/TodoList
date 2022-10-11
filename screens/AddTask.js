import React, {useEffect, useState, useRef} from 'react'
import { View, TextInput, Button, Text, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

const AddTask = ({navigation, route}) => {

    const [text, setText] = useState('')
    const [showDate, setshowDate] = useState(null)
    const [showTime, setShowTime] = useState(null)
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('')
    const webUrl = `https://todo.stokoza.co.za/public/api`
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        
        let tempDate = new Date(currentDate)
        let fDate = tempDate.getFullYear() + '-' + (("0"+(tempDate.getMonth()+1)).slice(-2)) + '-' + ("0"+tempDate.getDate()).slice(-2)
        setshowDate(fDate)
    };

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        
        let tempDate = new Date(currentDate)
        let fTime = ("0"+tempDate.getHours()).slice(-2) + ':' + ("0"+tempDate.getMinutes()).slice(-2)
        setShowTime(fTime)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const addTask = async() => {

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                ToastAndroid.show("Oops! Looks like you're not connected to the internet, please make you you have internet connection", ToastAndroid.LONG)
                return
            }
        });
        

        const objVar = await AsyncStorage.getItem('@userId');  
        const parsedId = JSON.parse(objVar);
        var pushNotification = ''

        if (text === '' || text.length === 0) {
            setError('Please enter task here')
        }

        if (showDate !== null) {
            const currentDate = new Date().getFullYear() + "-" + ("0"+(new Date().getMonth()+1)).slice(-2) + "-" + ("0"+new Date().getDate()).slice(-2)
            const currentTime = new Date().toLocaleTimeString()
            const currentDateTime = currentDate+"T"+currentTime+".000Z"
            const date1 = new Date(currentDateTime)
            const currentSeconds = date1.getTime() / 1000
            const datum = showDate+"T"+(showTime == null ? '00:00' : showTime)+":00.000Z"
            const date2 = new Date(datum);
            const seconds = date2.getTime() / 1000; //1440516958
            const timeInSeconds = seconds - currentSeconds
            pushNotification = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Hey, it's time",
                    body: text,
                    data: {
                        data: 'TodoList App'
                    }
                },
                trigger: {
                    seconds: timeInSeconds,
                }
            })
        }

        const formData = new FormData()
        formData.append('userId', parsedId)
        formData.append('task', text)
        formData.append('date', showDate)
        formData.append('time', showTime)
        formData.append('identifier', pushNotification)

        try {
            const res = await axios.post(`${webUrl}/addTask`, formData)
            ToastAndroid.show("New task added", ToastAndroid.SHORT)
            navigation.navigate("TodoList")
        } catch (error) {
            setError(error.response.data.task)
        }
    }

    return (
       <View style={styles.container}>
            <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                <View>
                    <Text style={{fontSize: 18, color: '#333'}}>New task</Text>
                    <TextInput
                        placeholder="Add task here"
                        placeholderTextColor='gray'
                        multiline
                        style={styles.textInput}
                        onChangeText={(text) => {setText(text), setError('')}}
                    />
                    {error ? <Text style={{ color: '#FF0000', fontSize: 14, marginTop: -40, marginBottom: 25}}>{error}</Text> : null}
                </View>

                <View>
                    <Text style={{fontSize: 18, color: '#333'}}>Due date</Text>
                    <View style={styles.inputIcon}>
                        <TouchableOpacity onPress={()=> showMode('date')} style={{width: '90%'}}>
                            <TextInput
                                placeholder="Day"
                                placeholderTextColor='gray'
                                pointerEvents="none"
                                editable={false}
                                style={styles.dueInput}
                                value={showDate}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setshowDate(null)}>
                            <FontAwesome5 name='times-circle' size={20} color='red' />
                        </TouchableOpacity>
                    </View>
                    {showDate !== null ? 
                        <View style={styles.inputIcon}>
                            <TouchableOpacity onPress={()=> showMode('time')} style={{width: '90%'}}>
                                <TextInput
                                    placeholder="Time"
                                    placeholderTextColor='gray'
                                    pointerEvents="none"
                                    editable={false}
                                    style={styles.dueInput}
                                    value={showTime}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> setShowTime(null)}>
                                <FontAwesome5 name='times-circle' size={20} color='red' />
                            </TouchableOpacity>
                        </View>
                    : null}
                </View>
                <View style={{ marginTop: 15 }}>
                    <Button title='Save' onPress={addTask}/>
                </View>

                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={mode == 'date' ? onChangeDate : onChangeTime}
                    minimumDate={new Date()}
                    />
                )}
            </View>
            <AdMobBanner
                    style={{position: 'absolute', bottom: 0}}
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3106841701777643/6086809582" // Test ID, Replace with your-admob-unit-id
                    servePersonalizedAds // true or false
            />
       </View>
    )
}

export default AddTask

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    textInput: {
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'Roboto',
        borderBottomWidth: 3,
        borderColor: "skyblue",
        marginTop: 20,
        fontSize: 20,
        maxHeight: 80,
        marginBottom: 40,
    },
    dueInput: {
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'Roboto',
        borderBottomWidth: 3,
        borderColor: "skyblue",
        marginTop: 20,
        fontSize: 15,
        color: '#333',
    },
    inputIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    }
})
