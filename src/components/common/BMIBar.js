import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";

const BMIBar = React.memo(({userBMI}) => {
    console.log('BMIBar render', userBMI)

    const barHeight = 12;
    const bmiCompartment = [17, 35];

    const bmiCompartmentSize = bmiCompartment[1] - bmiCompartment[0];

    const underWeightCompartmentPart = 1.5;
    const normalWeightCompartmentPart = 6.5;
    const overWeightCompartmentPart = 5;
    const obesityCompartmentPart = 5;

    const underWeightBarPercentage = Math.round(underWeightCompartmentPart/bmiCompartmentSize * 100) + '%';
    const normalWeightBarPercentage = Math.round(normalWeightCompartmentPart/bmiCompartmentSize * 100) + '%';
    const overWeightBarPercentage = Math.round(overWeightCompartmentPart/bmiCompartmentSize * 100) + '%';
    const obesityBarPercentage = Math.round(obesityCompartmentPart/bmiCompartmentSize * 100) + '%';

    const userBMICompartmentPercentage = Math.round(Math.min(Math.max(0,userBMI - bmiCompartment[0]), bmiCompartmentSize) / bmiCompartmentSize * 100) + '%';

    console.log(underWeightBarPercentage, normalWeightBarPercentage, overWeightBarPercentage, obesityBarPercentage);

    return (
        <View style={{width: '100%', alignItems: 'center', marginTop: '2%'}}>
            <View style={{width: '70%', heigth: barHeight, flexDirection: 'row',}}>
                <View style={{width: underWeightBarPercentage, height: barHeight, backgroundColor: '#5BD6FF', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}/>
                <View style={{width: normalWeightBarPercentage, height: barHeight, backgroundColor: '#A6FF7D'}}/>
                <View style={{width: overWeightBarPercentage, height: barHeight, backgroundColor: '#FFF068'}}/>
                <View style={{width: obesityBarPercentage, height: barHeight, backgroundColor: '#FF7676', borderTopRightRadius: 10, borderBottomRightRadius: 10}}/>
            </View>
            <View style={{width: '70%'}}>
                <Ionicons name='chevron-up-outline' size={22} color='white' style={{alignSelf: 'flex-start', transform: [{translateX: -11}], left: userBMICompartmentPercentage}}/>
            </View>
        </View>
    )
});

export default BMIBar;