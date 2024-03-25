import {View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useUserData } from '../../../providers/UserDataProvider';
import React, {useEffect, useState} from 'react';
import { Switch } from 'react-native-switch';
import Ionicons from '@expo/vector-icons/Ionicons';
import BMIBar from '../../../components/common/BMIBar';
import { useUserBMI, useUserSex } from '../../../providers/CommonDataProvider';

export default function BodyMeasurement() {

    const { userAge, setUserAge,
            userWeight, setUserWeight,
            userHeight, setUserHeight,
            calculateDailyIntake,
            userWeightTarget, userPhysicalActivity } = useUserData();

    const {userBMI} = useUserBMI();
    const { userSex, setUserSex } = useUserSex(); 

    const [newAge, setNewAge] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [newHeight, setNewHeight] = useState('');

    const [ageChanged, setAgeChanged] = useState(false);
    const [weightChanged, setWeightChanged] = useState(false);
    const [heightChanged, setHeightChanged] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);

    const handleAgeChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewAge(numericValue)
        setAgeChanged(value !== userAge.toString() && value);
    }

    const handleWeightChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewWeight(numericValue)
        setWeightChanged(value !== userWeight.toString() && value);
    }

    const handleHeightChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewHeight(numericValue)
        setHeightChanged(value !== userHeight.toString() && value);
    }

    const saveData = async () => {

        if(ageChanged){
            setUserAge(newAge);
        }
        if(weightChanged){
            setUserWeight(newWeight);
        }
        if(heightChanged){
            setUserHeight(newHeight);
        }

        setAgeChanged(false);
        setWeightChanged(false);
        setHeightChanged(false);

        console.log('saved')

    }

    const changeSex = () => {
        const newSex = userSex === 'male' ? 'female' : 'male';
        setUserSex(newSex);
    }

    useEffect(() => {
        if(componentLoaded){
            calculateDailyIntake(userSex, userAge, userWeight, userHeight, userWeightTarget, userPhysicalActivity);
        }else {
            setComponentLoaded(true);
        }
    }, [userSex, userAge, userWeight, userHeight]);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
        
            <View style={{height: 'auto', backgroundColor: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, }}>
            { (ageChanged || weightChanged || heightChanged) && ((userAge > 0 || newAge > 0) && (userWeight > 0 || newWeight > 0) && (userHeight > 0 || newHeight > 0)) ? 
                <TouchableOpacity style={{position: 'absolute', right: 0, marginRight: '2%', marginTop: '4%'}}  onPress={() => {saveData()}}>
                    <Ionicons name='checkmark-circle' size={60} color='white'/>
                </TouchableOpacity>
                : ''}
                <View style={{width: '100%', alignItems: 'center', top: '3%', justifyContent: 'center', height: '20%'}}>
                    <Switch
                        value={userSex === 'male' ? true : false}
                        onValueChange={() => changeSex()}
                        activeText='♂'
                        inActiveText='♀'
                        backgroundActive='#3399ff'
                        backgroundInactive='#ff80d5'
                        activeTextStyle={{fontSize: 27, top: -7, left: -2, position: 'relative'}}
                        inactiveTextStyle={{fontSize: 27, top: -5, left: 3, position: 'relative'}}
                        containerStyle={{borderColor: 'white', borderWidth: 0}}
                        circleBorderActiveColor='#3399ff'
                        circleBorderInactiveColor='#ff80d5'
                        
                    />
                </View>
                <View style={styles.inputsBox}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Age</Text>
                        <TextInput
                        style={styles.input}
                        placeholder={userAge.toString()}
                        placeholderTextColor='gray'
                        value={newAge}
                        keyboardType="numeric"
                        onChangeText={handleAgeChange}
                        maxLength={3}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Weight</Text>
                        <TextInput
                        style={styles.input}
                        placeholder={userWeight.toString()}
                        placeholderTextColor='gray'
                        value={newWeight}
                        keyboardType="numeric"
                        onChangeText={handleWeightChange}
                        maxLength={3}
                        />
                        <Text style={styles.inputUnit}>kg</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Height</Text>
                        <TextInput
                        style={styles.input}
                        placeholderTextColor='gray'
                        placeholder={userHeight.toString()}
                        value={newHeight}
                        keyboardType="numeric"
                        onChangeText={handleHeightChange}
                        maxLength={3}
                        />
                        <Text style={styles.inputUnit}>cm</Text>
                    </View>
                    <View style={styles.BMIContainer}>
                        <Text style={{color:'white', fontSize: 18, fontWeight: 'bold'}}>BMI</Text>
                        <Text style={{color:'white', fontSize: 18, fontWeight: 'bold'}}>{userBMI.toFixed(1)}</Text>

                        <BMIBar
                            userBMI={userBMI}
                        />
                    </View>
                    
                    
                    
                </View>
            </View>
            
        </View>
        </TouchableWithoutFeedback>
    )

}

const styles = StyleSheet.create({
    inputsBox:{
        top: '5%'
    },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            //backgroundColor: 'rgba(255,255,255,0.05)',
            marginVertical: '1%',
            
        },
            inputLabel: {
                textAlign: 'center',
                width: '20%',
                margin: '2%',
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold'
            },
            input: {
                width: '50%',
                backgroundColor: 'white',
                color: 'black',
                height:'auto',
                fontSize: 16,
                borderRadius: 10,
                paddingLeft: '2%'
            },
            inputUnit: {
                color: 'white',
                fontSize: 15,
                marginLeft: '1%'
            },
        BMIContainer: {
            paddingTop: '2%',
            alignItems: 'center',
        }
})