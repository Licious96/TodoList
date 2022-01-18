import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, ToastAndroid } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {

    const [listData, setListData] = useState([])
    const webUrl = `https://todo.stokoza.co.za/public/api`

    function byDate(a, b) {
        return new Date(a.date).valueOf() - new Date(b.date).valueOf()
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const objVar = await AsyncStorage.getItem('@userId');

                if (objVar) {
                    const parsedId = JSON.parse(objVar);
                    try {
                        const res = await axios.get(`${webUrl}/getTasks/${parsedId}`)
                        const todoList = res.data.map((DataItem, index) => ({
                            key: `${index}`,
                            id: DataItem.id,
                            task: DataItem.task,
                            date: DataItem.date,
                            time: DataItem.time,
                            done: DataItem.done
                        }))
                        let newData = todoList.filter(item => item.done !== 1)
                        let sorted = newData.sort(byDate)
                        setListData(sorted)
                    } catch (error) {
                        console.log(error.response.data)
                    }
                }
            };
            fetchUser();
        }, [])
    );

    const doneRow = async (id) => {
        
        try {
            const res = await axios.get(`${webUrl}/done/${id}`)
            let newData = listData.filter(item => item.id !== id)
            let sorted = newData.sort(byDate)
            setListData(sorted)
            ToastAndroid.show("Item marked as completed", ToastAndroid.SHORT)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const deleteRow = async (id) => {
        try {
            const res = await axios.get(`${webUrl}/destroy/${id}`)
            let newData = listData.filter(item => item.id !== id)
            let sorted = newData.sort(byDate)
            setListData(sorted)
            ToastAndroid.show("Item removed", ToastAndroid.SHORT)
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const VisibleItem = props => {
        const { data } = props
        return (
            <View style={styles.rowFront}>
                <TouchableHighlight style={styles.rowFrontVisible}>
                    <View>
                        <Text style={styles.title} >{data.item.task}</Text>
                        <Text style={styles.details}>Due: {data.item.date == 'null' ? 'No date' : data.item.date} {data.item.time == 'null' ? '' : data.item.time}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    const renderItem = (data, rowMap) => {
        return (
            <VisibleItem data={data} />
        )
    }

    const HiddenItemsWithActions = props => {
        const { onDone, onDelete } = props
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
                    <FontAwesome5 name='check' size={25} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deletetBtn} onPress={onDelete}>
                    <FontAwesome5 name='trash' size={25} color='#fff' />
                </TouchableOpacity>
            </View>
        )
    }

    const renderHiddenItem = (data, rowMap) => {
        return (
            <HiddenItemsWithActions
                data={data}
                rowMap={rowMap}
                onDone={() => doneRow(data.item.id)}
                onDelete={() => deleteRow(data.item.id)}
            />
        )
    }

    const empty = () => {
        return (
            <View style={styles.emptyContainer}>
                <FontAwesome5 name="clipboard-list" size={80} color="#448aff" />
                <Text style={{ color: '#1B5790', textAlign: 'center' }}>To-do list is empty, press the plus button to add new tasks</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                ListEmptyComponent={empty}
            />

            <TouchableOpacity style={styles.floatingActionBtn} onPress={() => navigation.navigate("AddTask")}>
                <FontAwesome5 name="plus" size={25} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        marginBottom: 55
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        height: 'auto',
        margin: 5,
        marginBottom: 10,
        shadowColor: '#999',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    rowFrontVisible: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        height: 'auto',
        padding: 10,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 15,
    },
    doneBtn: {
        alignItems: 'flex-start',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        paddingLeft: 17,
        borderRadius: 15,
        backgroundColor: 'green',
        width: 180
    },
    deletetBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        paddingRight: 17,
        borderRadius: 15,
        backgroundColor: 'red',
        width: 180
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#666',
    },
    details: {
        fontSize: 12,
        color: '#999',
    },
    floatingActionBtn: {
        backgroundColor: "#009387",
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        elevation: 5,
        right: 30,
        bottom: 30,
    },
    emptyContainer: {
        marginTop: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: 30
    },
});