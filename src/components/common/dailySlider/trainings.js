import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useCurrentDayInfo, useUserLoadedData, useSelectedDay, useTrainings } from '../../../providers/CommonDataProvider';
import { isCurrent } from '../../../utils/dateUtils';
import { colors } from '../../../styles/global';

export default function Trainings () {
    console.log('Trainings render');
    const { userDataLoaded } = useUserLoadedData();

    const { selectedDay } = useSelectedDay();
    const { currentDayInfo } = useCurrentDayInfo();

    const { 
        cardioDone, setCardioDone,
        strengthDone, setStrengthDone } = useTrainings();

    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused && userDataLoaded){
          updateCardioTraining();
        }
      }, [cardioDone]);
    
      useEffect(() => {
        if(isFocused && userDataLoaded){
          updateStrengthTraining();
        }
      }, [strengthDone]);
    
    
      const updateCardioTraining = async() => {
        console.log('Aktualizacja treningu Cardio.')
        const trainingsData = {
          date: currentDayInfo,
          trainings: {
              cardio: cardioDone,
              strength: strengthDone
          }
        }
        await AsyncStorage.setItem('lastSavedTrainings', JSON.stringify(trainingsData));
      }
    
      const updateStrengthTraining = async() => {
        console.log('Aktualizacja treningu Siłowego.')
        const trainingsData = {
          date: currentDayInfo,
          trainings: {
              cardio: cardioDone,
              strength: strengthDone
          }
        }
        await AsyncStorage.setItem('lastSavedTrainings', JSON.stringify(trainingsData));
      }


    return(
        <View >
            
            

            <Text style={[styles.trainingsTitle, { color: strengthDone ? colors.BLUE : 'gray'}]}>Work<Text style={[styles.trainingsTitle, { color: cardioDone ? colors.BLUE : 'gray'}]}>outs</Text></Text>
            <View style={styles.trainingsBox}>
              <View style={styles.trainingBox}>
                <TouchableOpacity style={[styles.trainingButton, {borderColor: strengthDone ? colors.BLUE : 'gray'}]} activeOpacity={0.7} onPress={() => setStrengthDone(!strengthDone)}>
                    <Text style={[styles.trainingType, { color: strengthDone ? colors.BLUE : 'gray'}]}>Strength</Text>
                    <View style={[styles.training, {borderColor: strengthDone ? colors.BLUE : 'gray'}]}>
                    <Ionicons name='barbell-outline' size={22} color={strengthDone ? colors.BLUE : 'gray'}/>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={styles.trainingBox}>
                <TouchableOpacity style={[styles.trainingButton, {borderColor: cardioDone ? colors.BLUE : 'gray'}]} activeOpacity={0.7} onPress={() => setCardioDone(!cardioDone)}>
                    <Text style={[styles.trainingType, { color: cardioDone ? colors.BLUE : 'gray'}]}>Cardio</Text>
                    <View style={[styles.training, {borderColor: cardioDone ? colors.BLUE : 'gray'}]}>
                    <Ionicons name='battery-charging-outline' size={22} color={cardioDone ? colors.BLUE : 'gray'}/>
                    </View>
                </TouchableOpacity>
              </View>
            </View>

            {!isCurrent(currentDayInfo, selectedDay) ? (
                <View style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.75)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
            ) : ''}
        </View>
    )

}

const styles = StyleSheet.create({
    trainingsTitle:{
      fontSize: 20,
      marginTop: '2%',
      marginBottom: '2%',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'gray',
    },
    trainingsBox: {
      height: '40%',
      width: '100%',
      flexDirection: 'row',
    },
      trainingBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      trainingButton: {
        width: '60%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
      },
        trainingType:{
          color: 'gray',
        },
        training: {
          width: '50%',
          alignItems: 'center',
          height: '50%',
          textAlignVertical: 'center',
        }
  })