import { View, Text, StyleSheet } from "react-native";
import { useCharacterStats, useCurrentHealth } from "../../../providers/CommonDataProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

export default function HealthBar() {
    console.log('HealthBar render')
    const { currentHealth } = useCurrentHealth();

    const { maxHealth } = useCharacterStats();

    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{marginRight: '3%'}}>
                <Ionicons name='heart' size={22} color='white'/>
            </View>
            <View style={styles.progressBox}>
                <Progress.Bar progress={currentHealth / maxHealth} width={150} height={7} color={'#ff6666'} unfilledColor='rgba(240,240,240,1)' borderColor='transparent' borderWidth={0} />
                <View style={{flexDirection: 'row', width: 150}}>
                    <Text style={styles.progressName}>Health</Text>
                    <Text style={styles.progressValue}>{currentHealth} / {maxHealth}</Text>
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
    }

})