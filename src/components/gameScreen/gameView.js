import {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useGameData } from '../../providers/GameDataProvider';
import { useGameLogic } from '../../providers/GameLogicProvider';
import { useCurrentEnergy, useGameLogs } from '../../providers/CommonDataProvider';
import { months } from '../../constants/calendar';

export default function GameView() {

    console.log('GameView render')

    const { gameStartStop } = useGameLogic();
    const { gameStarted } = useGameData();
    const { gameLogs } = useGameLogs();
    const { currentEnergy } = useCurrentEnergy();


    const GameLog = ({eventData}) => {
        const [isExpanded, setExpanded] = useState(false);

        const toggleExpansion = () => {
            setExpanded(!isExpanded);
            eventData.expanded = !eventData.expanded;
        }

        const eventDate = new Date(eventData.date);

        const dateString = `${eventDate.getDate()} ${months[eventDate.getMonth()]} ${eventDate.getHours()}:${eventDate.getMinutes()}:${eventDate.getSeconds()}`;

        return (
            <View style={{width: '100%', alignItems: 'center'}}>
                {eventData.title && <Text style={styles.gameLogTitle}>{eventData.title}</Text>}
                <View style={styles.gameLogBox}>
                    <Text style={styles.gameLogDate}>{dateString}</Text>
                    <Text style={styles.gameLogText}>{eventData.text}</Text>
                    {eventData.encounterLogs != 0 && (
                        <TouchableOpacity style={{alignItems: 'center'}} onPress={() => toggleExpansion()}>
                            <Ionicons name={eventData.expanded ? 'caret-up-outline' :'caret-down-outline' } size={22} color='white'/>
                        </TouchableOpacity>      
                    )}
                </View>
                {eventData.expanded && (
                    <View style={styles.gameLogEncounterBox}>
                        {eventData.encounterLogs.map((log, index) => (
                            <Text key={index} style={styles.gameLogEncounterText}>{log}</Text>
                        ))}    
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.gameView}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                
                <TouchableOpacity activeOpacity={0.4} disabled={currentEnergy == 0} style={[styles.button, currentEnergy == 0 && {backgroundColor:'gray'}]} onPress={() => gameStartStop()}> 
                    <Text style={styles.buttonText}> {!gameStarted ? 'START' : 'STOP'} </Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 5, alignItems: 'center', backgroundColor: 'transparent'}}>
                <View style={styles.textPanel}>
                    <FlatList
                        data={gameLogs}
                        renderItem={({item}) => <GameLog eventData={item}/>}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </View>
            </View>     
        </View>
    )
}

const styles = StyleSheet.create({
    gameView: {
        flex: 1,
    },
    textPanel: {
        width: '90%',
        height: '90%',
        borderColor: '#595959',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#1a1a1a',
        alignItems:'center',
    },
    button: {
        backgroundColor: 'white',
        width: '25%',
        borderRadius: 2,
        paddingHorizontal: 20,
        paddingVertical: 10

    },
    buttonText:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#4d4d4d'
    },
    gameLogTitle: {
        color: 'white',
        marginVertical: '1%',
        fontSize: 20,
        fontWeight: 'bold'
    },
    gameLogBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '2%',
        width: '97%'
    },
    gameLogDate: {
        left: '2%',
        top: '2%',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13
    },
    gameLogText: {
        color: 'white',
        margin: 10,
        textAlign: 'center'
    },
    gameLogEncounterBox: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    gameLogEncounterText: {
        textAlign: 'center',
        marginVertical: '2%',
        color: 'white',

    }
})