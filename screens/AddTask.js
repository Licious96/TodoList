import React, {useEffect, useState} from 'react'
import { View, TextInput, Button, Text, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

const AddTask = ({navigation, route}) => {

    const [text, setText] = useState('')
    const [showDate, setshowDate] = useState(null)
    const [showTime, setShowTime] = useState(null)
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('')
    const webUrl = `https://todo.stokoza.co.za/public/api`

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

        const objVar = await AsyncStorage.getItem('@userId');  
        const parsedId = JSON.parse(objVar);

        if (text === '' || text.length === 0) {
            return setError('Please enter task here')
        }

        const formData = new FormData()
        formData.append('userId', parsedId)
        formData.append('task', text)
        formData.append('date', showDate)
        formData.append('time', showTime)

        try {
            const res = await axios.post(`${webUrl}/addTask`, formData)
            ToastAndroid.show("New task added", ToastAndroid.SHORT)
            navigation.navigate("TodoList")
        } catch (error) {
            setError(error.response.data.task)
        }
    }
    return (
       
        <View style={{ margin: 20 }}>
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
    )
}

export default AddTask

const styles = StyleSheet.create({

    fieldView: {

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
