import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "../../styles/global";
import { useEffect, useState } from "react";
import BMIBar from "../../components/common/BMIBar";
import TargetBar from "../../components/common/TargetBar";
import ActivityBar from "../../components/common/ActivityBar";
import { useUserData } from "../../providers/UserDataProvider";
import { Switch } from "react-native-switch";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserSex } from "../../providers/CommonDataProvider";

export default function NewUserScreen () {

    const { setUserAge,
            setUserWeight,
            setUserHeight,

            calculateDailyIntake,

            setUserWeightTarget,
            setUserPhysicalActivity } = useUserData();

    const { setUserSex } = useUserSex();

    const [ newAge, setNewAge ] = useState('');
    const [ newWeight, setNewWeight ] = useState('');
    const [ newHeight, setNewHeight ] = useState('');
    const [ newSex, setNewSex ] = useState('male');

    const [ageChanged, setAgeChanged] = useState(false);
    const [weightChanged, setWeightChanged] = useState(false);
    const [heightChanged, setHeightChanged] = useState(false);

    const [ newBMI, setNewBMI ] = useState(0);
    const [ dataFilled, setDataFilled] = useState(false);

    const [ dataSaved, setDataSaved] = useState(false);

    const [ newWeightTarget, setNewWeightTarget] = useState(0);
    const [ newPhysicalActivity, setNewPhysicalActivity] = useState(0);

    const handleAgeChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewAge(numericValue)
        setAgeChanged(value > 0);
    }

    const handleWeightChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewWeight(numericValue)
        setWeightChanged(value > 0);
    }

    const handleHeightChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ""); 
        setNewHeight(numericValue)
        setHeightChanged(value > 0);
    }

    useEffect(() => {

        if(ageChanged && weightChanged && heightChanged){
            const BMI = newWeight / Math.pow(newHeight/100, 2);
            setNewBMI(BMI);
            setDataFilled(true);
        } else {
            setNewBMI(0);
            setDataFilled(false);
        }

    }, [newAge, newWeight, newHeight]);

    const changeSex = () => {
        if(newSex === 'male') {
            setNewSex('female');
        } else {
            setNewSex('male');
        }
    }

    const saveData = () => {
        setUserSex(newSex);
        setUserAge(newAge);
        setUserWeight(newWeight);
        setUserHeight(newHeight);
        setUserWeightTarget(newWeightTarget);
        setUserPhysicalActivity(newPhysicalActivity);
        setDataSaved(true);
        
    }

    useEffect(() => {
        if(dataSaved){
            calculateDailyIntake(newSex, newAge, newWeight, newHeight, newWeightTarget, newPhysicalActivity);
        }

    }, [dataSaved])


    return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={[styles.modalBox]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}> Enter your details </Text>
                    </View>

                    <View style={styles.modalInputsBox}>
                        <View style={styles.modalSwitchContainer}>
                            <Switch
                                value={newSex === 'male' ? true : false}
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
                        <View style={styles.modalInputContainer}>
                            <Text style={styles.modalInputLabel}>Age</Text>
                            <TextInput
                            style={styles.modalInput}
                            placeholderTextColor='gray'
                            value={newAge}
                            keyboardType="numeric"
                            onChangeText={handleAgeChange}
                            maxLength={3}
                            />
                        </View>
                        <View style={styles.modalInputContainer}>
                            <Text style={styles.modalInputLabel}>Weight</Text>
                            <TextInput
                            style={styles.modalInput}
                            placeholderTextColor='gray'
                            value={newWeight}
                            keyboardType="numeric"
                            onChangeText={handleWeightChange}
                            maxLength={3}
                            />
                            <Text style={styles.modalInputUnit}>kg</Text>
                        </View>
                        <View style={styles.modalInputContainer}>
                            <Text style={styles.modalInputLabel}>Height</Text>
                            <TextInput
                            style={styles.modalInput}
                            placeholderTextColor='gray'
                            value={newHeight}
                            keyboardType="numeric"
                            onChangeText={handleHeightChange}
                            maxLength={3}
                            />
                            <Text style={styles.modalInputUnit}>cm</Text>
                        </View>
                        <View style={styles.BMIContainer}>
                            <Text style={{color:'white', fontSize: 15, fontWeight: 'bold'}}>BMI</Text>
                            <Text style={{color:'white', fontSize: 15, fontWeight: 'bold'}}>{newBMI.toFixed(1)}</Text>

                            <BMIBar
                                userBMI={newBMI}
                            />
                        </View>
                    </View>

                    <View style={styles.modalSlidersContainer}>
                        <View style={{flex: 1}}>
                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: '3%'}}>
                            Target
                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 15}}> (kg/week)</Text>
                            </Text>
                            
                            <TargetBar userWeightTarget={newWeightTarget} setTempWeightTarget={setNewWeightTarget} width={0.9}/>
                        </View>

                        <View style={{flex: 1}}>
                            <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 0}}>Physical Activity</Text>

                            <ActivityBar userPhysicalActivity={newPhysicalActivity} setTempActivity={setNewPhysicalActivity} width={0.9}/>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            {dataSaved ? 
                                <ActivityIndicator size={50} color='gray'/>
                            : dataFilled ? 
                                <TouchableOpacity onPress={() => saveData()}>
                                    <Ionicons name='checkmark-circle' size={55} color='white'/>
                                </TouchableOpacity>
                            : ''}
                        </View>
                    </View>
                    
                </View>
            </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet. create({
    modalBox: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    modalHeader: {
        width: '100%',
        height: '10%',
        backgroundColor: colors.BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
    },
    modalInputsBox: {
        height: '45%',
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    modalSwitchContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalInputContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'rgba(255,255,255,0.05)',
    },
    modalInputLabel: {
        textAlign: 'center',
        width: '25%',
        margin: '2%',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalInput: {
        width: '50%',
        backgroundColor: 'white',
        color: 'black',
        height:'auto',
        fontSize: 16,
        borderRadius: 10,
        paddingLeft: '2%'
    },
    modalInputUnit: {
        color: 'white',
        fontSize: 15,
        marginLeft: '1%'
    },
    BMIContainer: {
        flex: 3,
        alignItems: 'center',
    },
    modalSlidersContainer: {
        top: '3%',
        height: '42%',
        //backgroundColor: 'blue'
    }


})