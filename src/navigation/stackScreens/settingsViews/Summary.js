import {View, Text, StyleSheet, Image, useWindowDimensions, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { useUserData } from '../../../providers/UserDataProvider';
import { vitamins, minerals, omega3Attributes, omega6Attributes } from '../../../constants/nutrients';

import { dailyNutrientIntake } from '../../../constants/nutrients';
import { useSelectedDayNutrients } from '../../../providers/CommonDataProvider';

export default function Summary() {

    const { dailyIntake } = useUserData();

    const { selectedDayNutrients } = useSelectedDayNutrients()

    console.log('Summary render')

    const screenWidth = useWindowDimensions().width;

    const progressBarWidth = screenWidth/2;

    const NutrientItem = ({nutrient, index}) => (
        <View style={{flexDirection: 'row', paddingVertical: '1%', alignItems: 'center'}}>
            <Text style={styles.nutrientText}>
                {nutrient.name}:
            </Text>
            <Progress.Bar style={styles.progressBar} 
                progress={selectedDayNutrients[nutrient.key] / dailyNutrientIntake[nutrient.key]} 
                width={progressBarWidth}
                height={8} 
                color={selectedDayNutrients[nutrient.key] > dailyNutrientIntake[nutrient.key] ? '#90FF5C' : '#FF7676'} 
                unfilledColor='white' 
                borderColor='black'
                borderWidth={0}
            />
            <View style={styles.intakeBox}>
                <Text style={styles.nutrientValue}>
                    {selectedDayNutrients[nutrient.key]}
                </Text>
                <Text style={styles.nutrientIntakeValue}>/ {dailyNutrientIntake[nutrient.key]}</Text>
            </View>
            <View style={{flex: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius:10}}>
            {nutrient.attributes &&
            nutrient.attributes.map((attributesRow, index) => (
                <View key={index} style={{flex: 1, flexDirection: 'row'}}>
                    {attributesRow.map ((attribute, index) => (
                        <Image key={index} source={attribute}  style={{flex: 1, height: '100%', resizeMode: 'contain'}}/>
                    ))}   
                </View>
            ))}
            </View>
        </View>
    )

    const SingleNutrientItem = ({indent = 0, fewerBetter=true, nutrientName, nutrientValue, nutrientDailyIntake}) => (
        <View style={{flexDirection: 'row', paddingVertical: '1%', alignItems: 'center'}}>
            <Text style={[styles.nutrientText, {left: indent * 10}]}>
                {nutrientName}:
            </Text>
            <Progress.Bar style={styles.progressBar} 
                progress={nutrientValue / nutrientDailyIntake} 
                width={progressBarWidth}
                height={8} 
                color={fewerBetter ? nutrientValue <= nutrientDailyIntake ? '#90FF5C' : '#FF7676' : nutrientValue >= nutrientDailyIntake ? '#90FF5C' : '#FF7676'} 
                unfilledColor='white' 
                borderColor='black'
                borderWidth={0}
            />
            <View style={{flex: 2, flexDirection: 'row'}}>
                <View style={styles.intakeBox}>
                    <Text style={styles.nutrientValue}>
                        {nutrientValue}
                    </Text>
                    <Text style={styles.nutrientIntakeValue}>/ {nutrientDailyIntake}</Text>
                </View>
                {nutrientName === 'Omega 3' &&
                <View style={{flex: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius:10}}>
                
                {omega3Attributes.map((attributesRow, index) => (
                    <View key={index} style={{flex: 1, flexDirection: 'row'}}>
                        {attributesRow.map ((attribute, index) => (
                            <Image key={index} source={attribute}  style={{flex: 1, height: '100%', resizeMode: 'contain'}}/>
                        ))}   
                    </View>
                ))}
                </View>
                }
                {nutrientName === 'Omega 6' &&
                <View style={{flex: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius:10}}>
                
                {omega6Attributes.map((attributesRow, index) => (
                    <View key={index} style={{flex: 1, flexDirection: 'row'}}>
                        {attributesRow.map ((attribute, index) => (
                            <Image key={index} source={attribute}  style={{flex: 1, height: '100%', resizeMode: 'contain'}}/>
                        ))}   
                    </View>
                ))}
                </View>
                }

            </View>
        </View>
    )

    return (
        <View >
            <ScrollView>


                <Text style={styles.categoryTitle}>Caloric Overview</Text>
                <View style={styles.categoryBox}>
                    <SingleNutrientItem nutrientName='Calories' nutrientValue={Math.round(selectedDayNutrients.totalCalories)} nutrientDailyIntake={Math.round(dailyIntake.dailyCaloricIntake)}/>
                    <SingleNutrientItem nutrientName='Proteins' nutrientValue={Math.round(selectedDayNutrients.totalProteins)} nutrientDailyIntake={Math.round(dailyIntake.dailyProteinIntake[1])}/>
                    <SingleNutrientItem nutrientName='Carbohydrates' nutrientValue={Math.round(selectedDayNutrients.totalCarbohydrates)} nutrientDailyIntake={Math.round(dailyIntake.dailyCarbohydratesIntake[1])}/>
                        <SingleNutrientItem indent={1} nutrientName='Sugars' nutrientValue={Math.round(selectedDayNutrients.totalSugar)} nutrientDailyIntake={Math.round(dailyIntake.dailySugarIntake)}/>
                    <SingleNutrientItem nutrientName='Fats' nutrientValue={Math.round(selectedDayNutrients.totalFat)} nutrientDailyIntake={Math.round(dailyIntake.dailyFatIntake[1])}/>
                        <SingleNutrientItem indent={1} nutrientName='Saturated' nutrientValue={Math.round(selectedDayNutrients.totalSaturated)} nutrientDailyIntake={Math.round(dailyIntake.dailySaturatedFatIntake)}/>
                        <SingleNutrientItem indent={1} nutrientName='Mono Unsaturated' nutrientValue={Math.round(selectedDayNutrients.totalMonoUnsaturated)} nutrientDailyIntake={Math.round(dailyIntake.dailyMonoUnsaturatedFatIntake)}/>
                        <SingleNutrientItem indent={1} nutrientName='Poly Unsaturated' nutrientValue={Math.round(selectedDayNutrients.totalPolyUnsaturated)} nutrientDailyIntake={Math.round(dailyIntake.dailyPolyUnsaturatedFatIntake)}/>
                            <SingleNutrientItem indent={3} nutrientName='Omega 3' nutrientValue={Math.round(selectedDayNutrients.totalALA + selectedDayNutrients.totalDHA + selectedDayNutrients.totalEPA)} nutrientDailyIntake={Math.round(dailyNutrientIntake.totalOmega3Intake)}/>
                            <SingleNutrientItem indent={3} nutrientName='Omega 6' nutrientValue={Math.round(selectedDayNutrients.totalLA)} nutrientDailyIntake={Math.round(dailyNutrientIntake.totalOmega6Intake)}/>
                    <SingleNutrientItem nutrientName='Fiber' nutrientValue={Math.round(selectedDayNutrients.totalFiber)} nutrientDailyIntake={Math.round(dailyNutrientIntake.totalFiber)}/>
                    <SingleNutrientItem nutrientName='Caffeine' nutrientValue={Math.round(selectedDayNutrients.totalCaffeine)} nutrientDailyIntake={Math.round(dailyNutrientIntake.totalCaffeine)}/>
                    <SingleNutrientItem nutrientName='Cholesterol' nutrientValue={Math.round(selectedDayNutrients.totalCholesterol)} nutrientDailyIntake={Math.round(dailyNutrientIntake.totalCholesterol)}/>
                </View>



                <Text style={styles.categoryTitle}>Vitamins</Text>
                <View style={styles.categoryBox}>
                    {vitamins.map((vitamin, index) => (
                        <NutrientItem nutrient={vitamin} key={index}/>
                    ))}
                </View>


                <Text style={styles.categoryTitle}>Minerals</Text>
                <View style={styles.categoryBox}>
                    {minerals.map((mineral, index) => (
                        <NutrientItem nutrient={mineral} key={index}/>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    categoryBox: {
        alignSelf: 'center',
        borderRadius: 10,
        width: '97%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: '2%',
        padding: '2%'
    },
    categoryTitle: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        marginVertical: '1%'
    },
    nutrientText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
        left: '1%',
        flex: 4,
        //textAlign: 'center'
    },
    progressBar: {
        alignSelf: 'center',
        flex: 4
    },
    intakeBox: {
        flexDirection: 'column',
        flex: 2,
    },
        nutrientValue: {
            color: 'white',
            textAlign: 'center'
        },
        nutrientIntakeValue: {
            color: 'gray',
            textAlign: 'center'
        }
})