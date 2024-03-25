import { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TargetBar from '../../../components/common/TargetBar';
import ActivityBar from '../../../components/common/ActivityBar';
import { useUserData } from '../../../providers/UserDataProvider';
import { useUserSex } from '../../../providers/CommonDataProvider';

export default function Target() {

    const { userAge, userWeight, userHeight,
            calculateDailyIntake,

            userWeightTarget, setUserWeightTarget,
            userPhysicalActivity, setUserPhysicalActivity} = useUserData();

    const { userSex } = useUserSex();

    const [tempWeightTarget, setTempWeightTarget] = useState(userWeightTarget);
    const [tempActivity, setTempActivity] = useState(userPhysicalActivity);

    const [targetChanged, setTargetChanged] = useState(false);
    const [activityChanged, setActivityChanged] = useState(false);

    const [componentLoaded, setComponentLoaded] = useState(false);

    useEffect(() => {
        if(tempWeightTarget != userWeightTarget){
            setTargetChanged(true);
        } else {
            setTargetChanged(false);
        }
    }, [tempWeightTarget]);

    useEffect(() => {
        if(tempActivity != userPhysicalActivity){
            setActivityChanged(true);
        } else {
            setActivityChanged(false);
        }
    }, [tempActivity]);



    const saveTargetAndActivity = () => {
        if(targetChanged){
            setUserWeightTarget(tempWeightTarget);
        }

        if(activityChanged){
            setUserPhysicalActivity(tempActivity);
        }

        setActivityChanged(false);
        setTargetChanged(false);
    }

    useEffect(() => {
        if(componentLoaded){
            calculateDailyIntake(userSex, userAge, userWeight, userHeight, userWeightTarget, userPhysicalActivity);
        }else {
            setComponentLoaded(true);
        }
    }, [userPhysicalActivity, userWeightTarget])


    return (
        <View>
            <View style={{backgroundColor: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: '4%'}}>Target</Text>
                <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 15, marginTop: '2%', marginBottom: '4%'}}>(kg/week)</Text>

                <TargetBar userWeightTarget={userWeightTarget} setTempWeightTarget={setTempWeightTarget}/>

                <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 0}}>Activity</Text>
                <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 15, marginTop: '2%', marginBottom: '4%'}}>(physical activity during week)</Text>

                <ActivityBar userPhysicalActivity={userPhysicalActivity} setTempActivity={setTempActivity}/>
                

            </View>
            {targetChanged || activityChanged ?
            <TouchableOpacity style={{alignItems: 'center', marginTop: '5%'}}  onPress={() => {saveTargetAndActivity()}}>
                <Ionicons name='checkmark-circle' size={40} color='white'/>
            </TouchableOpacity>
            : ''}
        </View>
    )
}

