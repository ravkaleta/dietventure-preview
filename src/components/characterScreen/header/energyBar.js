import { View, Text, StyleSheet } from "react-native";
import { useCharacterStats, useCurrentEnergy } from "../../../providers/CommonDataProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

export default function EnergyBar() {
    console.log('EnergyBar render');

    const {currentEnergy } = useCurrentEnergy();

    const { maxEnergy } = useCharacterStats();

    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{marginRight: '3%'}}>
                <Ionicons name='flash' size={22} color='white'/>
            </View>
            <View style={styles.progressBox}>
                <Progress.Bar progress={currentEnergy / maxEnergy} width={150} height={7} color={'#71da71'} unfilledColor='rgba(240,240,240,1)' borderColor='rgba(240,240,240,1)' borderWidth={0}/>
                <View style={{flexDirection: 'row', width: 150}}>
                    <Text style={styles.progressName}>Energy</Text>
                    <Text style={styles.progressValue}>{currentEnergy} / {maxEnergy}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    progressBox: {
        marginVertical: '2%'
    },
    progressName: {
        fontSize: 13,
        color: 'white',
        textAlign: 'left',
        //backgroundColor: 'red',
        flex: 1
    },
    progressValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'right',
        flex: 1
    },

})