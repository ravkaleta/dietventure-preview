import { useState } from "react";
import { Text, View } from "react-native";
import { useUserAttributes } from "../../../providers/CommonDataProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Developer() {

    const { userAttributes, setUserAttributes } = useUserAttributes();

    const [newUserAttributes, setNewUserAttributes] = useState(userAttributes);

    const decrementAttribute = (attributeKey) => {

        const updatedAttributes = {
            ...newUserAttributes,
            [attributeKey]: {
                ...newUserAttributes[attributeKey],
                value: Math.min(Math.max(1,newUserAttributes[attributeKey].value - 1),10)
            }
        };

        setNewUserAttributes(updatedAttributes);
    }

    const incrementAttribute = (attributeKey) => {

        const updatedAttributes = {
            ...newUserAttributes,
            [attributeKey]: {
                ...newUserAttributes[attributeKey],
                value: Math.min(Math.max(1,newUserAttributes[attributeKey].value + 1),10)
            }
        };

        setNewUserAttributes(updatedAttributes);
    }


    const saveAttributes = async () => {
        const userData = await AsyncStorage.getItem('userData');
        const userDataParsed = userData ? JSON.parse(userData) : null;

        if(userDataParsed){
            userDataParsed.attributes = newUserAttributes;

            await AsyncStorage.setItem('userData', JSON.stringify(userDataParsed));
            setUserAttributes(newUserAttributes);
        } else {
            console.log('Coś poszło nie tak');
        }
    }

    const deleteUserData = async () => {
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('userGold');
    }

    return(
        <View style= {{flex: 1, alignItems: 'center'}}>
            <View style={{width: '100%', height: '75%', flexDirection: 'row'}}>
                <View style={{width: '50%', height: '100%'}}>

                    {Object.keys(newUserAttributes).map((key, index) => (

                    <View key={index} style={{flex: 1, flexDirection: 'row', marginVertical: '1%'}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => decrementAttribute(key)}>
                                <Ionicons name='remove-circle' size={40} color='white'/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}> {key.substring(0,3).toUpperCase()}</Text>
                            <Text style={{flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}> {newUserAttributes[key].value} </Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => incrementAttribute(key)}>
                                <Ionicons name='add-circle' size={40} color='white'/>
                            </TouchableOpacity>
                        </View>
                    </View>

                ))}
                </View>
                <View style={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => saveAttributes()}>
                        <Ionicons name='checkbox' size={75} color='white'/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width: '100%', height: '25%', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{color: 'red', borderWidth: 2, borderRadius: 20, borderColor: 'red', justifyContent: 'center', alignItems: 'center'}} onPress={() => deleteUserData()}>
                    <Text style={{color: 'red', fontSize: 22, textAlign: 'center', textAlignVertical: 'center', padding: '5%'}}>
                        Delete Character Data
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}