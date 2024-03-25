import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelectedDayNutrients } from '../../../providers/CommonDataProvider';
import { useUserData } from '../../../providers/UserDataProvider';
import { colors, dimensions } from '../../../styles/global';


export default function MacroBar({selectedScreen}) {
  console.log('MacroBar render');

  const screenWidth = useWindowDimensions().width;

  const { selectedDayNutrients } = useSelectedDayNutrients();
  const { dailyIntake } = useUserData();

  const overfillColor = '#ff0000';

  const visiblePartHeight = dimensions.sliderHeight;

  const progressBarWidth = (screenWidth - screenWidth/8)/4;
  const unfilledColor = colors.LIGHT_GRAY;

  

return (
          <View style={[styles.progressBox,{height: visiblePartHeight * 0.7}]}>
            <View style={styles.kcalProgress}>
              <Text style={styles.statsText}>Calories</Text>
              <View>
                <Progress.Bar progress={selectedDayNutrients.totalCalories / dailyIntake.dailyCaloricIntake} width={progressBarWidth} color={'#33cc33'} unfilledColor={unfilledColor} borderColor={unfilledColor}/>
                {selectedDayNutrients.totalCalories > dailyIntake.dailyCaloricIntake ?
                  <Progress.Bar style={{position: 'absolute'}} progress={(selectedDayNutrients.totalCalories - dailyIntake.dailyCaloricIntake) / dailyIntake.dailyCaloricIntake} width={80} color={overfillColor} unfilledColor='transparent' borderColor='transparent'/>
                  : ''
                }      
              </View>
              <Text>{Math.round(selectedDayNutrients.totalCalories)}<Text style={{color: 'gray'}}> /{Math.round(dailyIntake.dailyCaloricIntake)}</Text></Text>
            </View>
            <View style={styles.macroProgress}>
              <Text style={styles.statsText}>Proteins</Text>
              <View>
                <Progress.Bar progress={selectedDayNutrients.totalProteins / dailyIntake.dailyProteinIntake[1]} width={progressBarWidth} color={'#00ccff'} unfilledColor={unfilledColor} borderColor={unfilledColor}/>
                {selectedDayNutrients.totalProteins > dailyIntake.dailyProteinIntake[1] ?
                  <Progress.Bar style={{position: 'absolute'}} progress={(selectedDayNutrients.totalProteins - dailyIntake.dailyProteinIntake[1]) / dailyIntake.dailyProteinIntake[1]} width={80} color={overfillColor} unfilledColor='transparent' borderColor='transparent'/>
                  : ''
                }      
              </View>
              <Text>{Math.round(selectedDayNutrients.totalProteins)}<Text style={{color: 'gray'}}> /{Math.round(dailyIntake.dailyProteinIntake[1])}</Text></Text>
            </View>
            <View style={styles.macroProgress}>
              <Text style={styles.statsText}>Carbohydrates</Text>

              <View>
                <Progress.Bar progress={selectedDayNutrients.totalCarbohydrates / dailyIntake.dailyCarbohydratesIntake[1]} width={progressBarWidth} color={'#6600ff'} unfilledColor={unfilledColor} borderColor={unfilledColor}/>
                {selectedDayNutrients.totalCarbohydrates > dailyIntake.dailyCarbohydratesIntake[1] ?
                  <Progress.Bar style={{position: 'absolute'}} progress={(selectedDayNutrients.totalCarbohydrates - dailyIntake.dailyCarbohydratesIntake[1]) / dailyIntake.dailyCarbohydratesIntake[1]} width={80} color={overfillColor} unfilledColor='transparent' borderColor='transparent'/>
                  : ''
                }      
              </View>

              <Text>{Math.round(selectedDayNutrients.totalCarbohydrates)}<Text style={{color: 'gray'}}> /{Math.round(dailyIntake.dailyCarbohydratesIntake[1])}</Text></Text>
            </View>
            <View style={styles.macroProgress}>
              <Text style={styles.statsText}>Fats</Text>

              <View>
              <Progress.Bar progress={selectedDayNutrients.totalFat / dailyIntake.dailyFatIntake[1]} width={progressBarWidth} color={'#ffcc00'} unfilledColor={unfilledColor} borderColor={unfilledColor}/>
                {selectedDayNutrients.totalFat > dailyIntake.dailyFatIntake[1] ?
                  <Progress.Bar style={{position: 'absolute'}} progress={(selectedDayNutrients.totalFat - dailyIntake.dailyFatIntake[1]) / dailyIntake.dailyFatIntake[1]} width={80} color={overfillColor} unfilledColor='transparent' borderColor='transparent'/>
                  : ''
                }      
              </View>

              <Text>{Math.round(selectedDayNutrients.totalFat)}<Text style={{color: 'gray'}}> /{Math.round(dailyIntake.dailyFatIntake[1])}</Text></Text>
            </View>
          </View>    
)
}

const styles = StyleSheet.create({

  statsText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    //textTransform: 'uppercase'
  },
  progressBox: {
    width: '100%',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  kcalProgress: {
    flex: 1,
    alignItems: 'center'
  },
  macroProgress: {
    flex: 1,
    alignItems: 'center'
  },
})