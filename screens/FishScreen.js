import React, {useState, useEffect, useMemo} from 'react';
import { View, Text, StyleSheet, Keyboard, Modal, ScrollView, Alert, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from "@react-navigation/native";
import Fish from '../model/Fish';
import {FishClown} from "../components/FishClown"
import {FishOrange2} from "../components/FishOrange2";;
import {FishOrange} from "../components/FishOrange";
import {FishBlue} from "../components/FishBlue";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Caption, Paragraph} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import LottieView from 'lottie-react-native'


export const FishScreen = ({navigation}) => {
    const {colors} = useTheme();
    const theme = useTheme();

    const [name, setName] = useState(null)
    const [title, setTitle] = useState(null)
    const [quantity, setQuantity] = useState(null)
    const [fishItems, setFishItems] = useState([]);
    const[isLoading, setIsLoading] = useState(false)

    useEffect( () => {
        setTimeout(async() => {
            try {
                const myArray = await AsyncStorage.getItem('fishItems');
                setFishItems([...JSON.parse(myArray)]);
            } catch (e) {
                console.log(e)
            }
            setIsLoading(true)
            navigation.navigate("HomeDrawer")
        }, 2000)
    }, [])

    const handleAddFish = async () => {
        let myArray = await AsyncStorage.getItem('fishItems');
        Keyboard.dismiss()
        let data = {
            key: fishItems.length.toString(),
            name: name,
            title: title,
            details: '',
            quantity: quantity,
        }
        setFishItems([...JSON.parse(myArray), data])
        setName(null)
        setTitle(null)
        setQuantity(null)
        setIsModalVisible(false);

        try {
            await AsyncStorage.setItem('fishItems', JSON.stringify([...JSON.parse(myArray), data]));
        } catch (e) {
            console.log(e)
        }
    }

    const completeFish = async (index) => {
        let itemsCopy = [...fishItems]
        itemsCopy.splice(index, 1);
        setFishItems(itemsCopy)
        try {
            await AsyncStorage.setItem('fishItems', JSON.stringify([...itemsCopy]));
        } catch (e) {
            console.log(e)
        }
    }

    const changeFish = async (index) => {
        Keyboard.dismiss()
        let data = {
            key: fishItems.length.toString(),
            name: name,
            title: title,
            details: '',
            quantity: quantity,
        }
        let items = [
            ...fishItems.slice(0, index),
            fishItems[index] = data,
            ...fishItems.slice(index + 1)
        ]
        setFishItems(items)
        setName(null)
        setTitle(null)
        setQuantity(null)
        setIsModalVisible(false);
        setIsModalFish(false)
        try {
            await AsyncStorage.setItem('fishItems', JSON.stringify(items));
        } catch (e) {
            console.log(e)
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false)

    const openModal = async () => {setIsModalVisible(true);}

    const closeModal = () => {
        setName(null)
        setTitle(null)
        setQuantity(null)
        setIsModalVisible(false);
        setIsModalFish(false)
    }

    const [isModalFish, setIsModalFish] = useState(false)
    const [modalIndex, setModalIndex] = useState(false)

    const openModalFish = (index) => {
        setIsModalVisible(true);
        setName(fishItems[index].name === null ? "" : fishItems[index].name)
        setTitle(fishItems[index].title === null ? "" : fishItems[index].title)
        setQuantity(fishItems[index].quantity === null ? "1" : fishItems[index].quantity.toString())
        setIsModalFish(true)
        setModalIndex(index)
    }

    const openDeleteAlert = (index) => {
        Alert.alert(
            "Вы действительно хотите удалить рыбку?", "",
            [
                {text: 'да', onPress: () => completeFish(index)},
                {text: 'нет'}
            ]
        )
    }

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <Modal transparent={true} visible={isModalVisible}>
                <StatusBar backgroundColor={colors.background}/>
                <Animatable.View animation="lightSpeedIn"
                                 style={[styles.modelContentWrapper, {backgroundColor: colors.background}]}>
                    <TouchableOpacity style={styles.closeBtnWrapper} onPress={() => closeModal()}>
                        <MaterialCommunityIcons style={styles.closeModal} name="close" size={26} color={colors.text}/>
                    </TouchableOpacity>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.textInput, {backgroundColor: colors.background2, color: colors.text}]}
                            placeholder="Введите имя рыбки" onChangeText={text => setName(text)} value={name}
                            placeholderTextColor={'#666'}/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.textInput, {backgroundColor: colors.background2, color: colors.text}]}
                            placeholder="Введите научное название" onChangeText={text => setTitle(text)} value={title}
                            placeholderTextColor={'#666'}/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.textInput, {backgroundColor: colors.background2, color: colors.text}]}
                            placeholder="Введите количество" onChangeText={text => setQuantity(text)}
                            value={quantity} placeholderTextColor={'#666'}/>
                    </View>
                    {isModalFish ?
                        <TouchableOpacity onPress={() => changeFish(modalIndex)} style={[styles.btnWrapper,
                            {backgroundColor: colors.background2}]}>
                            <Text style={{textAlign: 'center', color: colors.text}}>Сохранить</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={() => handleAddFish()} style={[styles.btnWrapper,
                            {backgroundColor: colors.background2}]}>
                            <Text style={{textAlign: 'center', color: colors.text}}>Сохранить</Text>
                        </TouchableOpacity>
                    }
                </Animatable.View>
            </Modal>

            { !isLoading ? null :
                <View style={{ paddingTop: 80, paddingHorizontal: 20, paddingBottom: 20, flexDirection: "row"}}>
                    <TouchableOpacity style={{height: '100%', width: 50, }} onPress={() => navigation.goBack()} >
                        <MaterialCommunityIcons name="arrow-left" size={35} color={colors.text}/>
                    </TouchableOpacity>
                    <Text style={[styles.sectionTitle, {color: colors.text}]}>Список рыбок</Text>
                </View>
            }
            { !isLoading ? <LottieView source={require('../components/6729-fish.json')} autoPlay loop/>:
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                    <View style={styles.tasksWrapper}>
                        <View style={styles.items}>
                            {
                                fishItems.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => openModalFish(index)} key={index}
                                                          style={[styles.item, {backgroundColor: colors.background2}]}>
                                            <View style={[styles.itemLeft, {width: '75%'}]}>
                                                <View style={styles.square}>
                                                    <FishOrange2/>
                                                </View>
                                                <View>
                                                {
                                                    item.name === '' || item.name === null ? null :
                                                        <Paragraph style={[styles.paragraph, styles.caption,
                                                            {color: colors.text}]}>{item.name}</Paragraph>
                                                }
                                                {
                                                    item.title === '' || item.title === null ? null :
                                                        <Caption style={[styles.caption, {color: theme.dark ?
                                                                "rgba(255,255,255, 0.5)" : "rgba(0,0,0, 0.5)"}]}>
                                                            {item.title}</Caption>
                                                }
                                            </View>
                                            </View>
                                            {
                                                item.quantity === '' || item.quantity === null ?
                                                    <Paragraph style={[styles.paragraph, styles.caption,
                                                        {color: colors.text}]}>{" x1"}</Paragraph>
                                                    :
                                                    <Paragraph style={[styles.paragraph, styles.caption,
                                                        {color: colors.text}]}>{" x" + item.quantity}</Paragraph>
                                            }
                                            <TouchableOpacity onPress={() => openDeleteAlert(index)}>
                                                <MaterialCommunityIcons name="close" size={26} color={colors.text}/>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            }
            { !isLoading ? null: <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                                       style={styles.writeTaskWrapper}>
                <TouchableOpacity onPress={() => openModal()}>
                    <View style={[styles.addWrapper, {
                        backgroundColor: theme.dark ? '#004943' : '#009387',
                        marginRight: 20
                    }]}>
                        <Text style={[styles.addText, {color: "white"}]}>+</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
    },
    tasksWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 60
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    items: {
        marginTop: 20,
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',//'space-around',
        alignItems: 'center',
        left: 10
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: 250,
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        //  borderWidth: 1,

    },
    addText: {
        fontSize: 26,
    },
    item: {
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        /* backgroundColor: '#55BCF6',
       * opacity: 0.4,
         borderRadius: 5,*/
        marginRight: 15,
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5,
    },
    modelContentWrapper: {
        height: '100%',
        marginTop: 'auto',
        padding: 15
    },
    closeModal: {
        width: 40,
        height: 40,
    },
    closeBtnWrapper: {
        alignItems: 'flex-end',
        marginTop: 45,
        marginRight: 10
    },
    inputWrapper: {
        marginTop: 30
    },
    textInput: {
        padding: 15,
        fontSize: 18,
        borderRadius: 20
    },
    btnWrapper: {
        marginTop: 30,
        padding: 15,
        borderRadius: 20
    }
});
