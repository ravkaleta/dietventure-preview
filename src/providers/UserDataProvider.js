import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import startingAttributes from '../constants/startingAttributes';
import * as nutrientConstants from '../constants/nutrients';
import * as dateUtils from '../utils/dateUtils';
import { updateAttributes, updateAttributesFromTrainings } from '../utils/updateAttributes';
import { useCurrentDayInfo, useNewUser, useTrainings, useUserAttributes, useUserBMI, useUserLoadedData, useUserSex } from './CommonDataProvider';

const UserDataContext = createContext();

export function useUserData() {
    return useContext(UserDataContext);
}

export function UserDataProvider({children}) {
    console.log('UserData load');

    const { setUserDataLoaded } = useUserLoadedData();
    const { isUserNew, setIsUserNew} = useNewUser();
    const { currentDayInfo } = useCurrentDayInfo();
    const { setCardioDone, setStrengthDone } = useTrainings();
    const { userAttributes, setUserAttributes} = useUserAttributes();
    const { userBMI, setUserBMI } = useUserBMI();
    const { userSex, setUserSex } = useUserSex();

    const currentDate = new Date();

    const [username, setUsername] = useState('Anonim');
    const [userWeight, setUserWeight] = useState(0);
    const [userHeight, setUserHeight] = useState(0);
    const [userAge, setUserAge] = useState(0);

    const [userWeightTarget, setUserWeightTarget] = useState(0);
    const [userPhysicalActivity, setUserPhysicalActivity] = useState(0);
    const [dailyIntake, setDailyIntake] = useState(nutrientConstants.startingMacroIntake);





    const fetchUserData = async () => {
        try {

            const userData = await AsyncStorage.getItem('userData');
            const userDataParsed = userData ? JSON.parse(userData) : null;

            const lastSavedNutrients = await AsyncStorage.getItem('lastSavedNutrients');
            const lastSavedNutrientsParsed = lastSavedNutrients ? JSON.parse(lastSavedNutrients) : null;

            const lastSavedTrainings = await AsyncStorage.getItem('lastSavedTrainings');
            const lastSavedTrainingsParsed = lastSavedTrainings ? JSON.parse(lastSavedTrainings) : null;


            console.log('SPRAWDZANIE DANYCH UŻYTKOWNIKA.');
            if(userDataParsed){
                console.log('Użytkownik już istnieje.');
                console.log('');
                if(userDataParsed.newUser){
                    console.log('Użytkownik nie zaktualizował jeszcze swoich danych');
                    setIsUserNew(true);

                } else {

                    console.log('SPRAWDZANIE ZAPISANYCH WARTOŚCI ODŻYWCZYCH');
                    if(lastSavedNutrientsParsed){
                        console.log('Wartości odżywcze są już w AsyncStorage');
                        if(lastSavedNutrientsParsed.date.day != currentDayInfo.day || lastSavedNutrientsParsed.date.month != currentDayInfo.month || lastSavedNutrientsParsed.date.year != currentDayInfo.year){       
                            console.log('Data różni się od ostatniej zapisanej.')
                            const lastUpdateDate = dateUtils.toDate(lastSavedNutrientsParsed.date);
                            const currentDateReset = dateUtils.resetTime(currentDate);
                            const dayDifference = dateUtils.compareDates(currentDateReset, lastUpdateDate);
        
                            console.log('Liczba dni minionych od ostatniego zapisu:', dayDifference);
                            if(dayDifference > 0){
                                console.log('Minęła więcej niż doba. Aktualizuje atrybuty użytkownika.')
                                await updateAttributes(dayDifference, userDataParsed, lastSavedNutrientsParsed.nutrients, nutrientConstants.dailyNutrientIntake);
                            }  
                            console.log('Atrybuty aktualne.');

                        }else{
                            console.log('Dane są aktualne.');
                        }
                    }else {
                        console.log('Brak wartości odżywczych w AsyncStorage. Zostaną one dodane.');
                    }
                    console.log('');
                    //setAttributesUpdated(true);



                    console.log('SPRAWDZANIE ZAPISANYCH TRENINGÓW');
                    if(lastSavedTrainingsParsed){
                        console.log('Treningi są już w AsyncStorage');
                        console.log(lastSavedTrainingsParsed);
                        if(lastSavedTrainingsParsed.date.day != currentDayInfo.day || lastSavedTrainingsParsed.date.month != currentDayInfo.month || lastSavedTrainingsParsed.date.year != currentDayInfo.year){
                            console.log('Data różni się od ostatniej zapisanej.');
                            const lastUpdateDate = dateUtils.toDate(lastSavedTrainingsParsed.date);
                            const currentDateReset = dateUtils.resetTime(currentDate);
                            const dayDifference = dateUtils.compareDates(currentDateReset, lastUpdateDate);
        
                            console.log('Liczba dni minionych od ostatniego zapisu:', dayDifference);
                            if(dayDifference > 0){
                                console.log('Minęła więcej niż doba. Aktualizuje atrybuty użytkownika.')
                                await updateAttributesFromTrainings(dayDifference, userDataParsed, lastSavedTrainingsParsed.trainings);
                                const trainingsData = {
                                    date:currentDayInfo,
                                    trainings: {
                                        cardio: false,
                                        strength: false
                                    }
                                }
                                await AsyncStorage.setItem('lastSavedTrainings', JSON.stringify(trainingsData));
                            }
                            console.log('Atrybuty aktualne.');
                        }else{
                            console.log('Dane są aktualne.')
                            setCardioDone(lastSavedTrainingsParsed.trainings.cardio);
                            setStrengthDone(lastSavedTrainingsParsed.trainings.strength);
                        } 
                    }else {
                        console.log('Brak danych o treningach w AsyncStorage. Zostaną one dodane.');
                        const trainingsData = {
                            date:currentDayInfo,
                            trainings: {
                                cardio: false,
                                strength: false
                            }
                        }
                        await AsyncStorage.setItem('lastSavedTrainings', JSON.stringify(trainingsData));
                    }
                    console.log('');




                    console.log('Przypisywanie zapisanych danych użytkownika.');
                    setUsername(userDataParsed.name);
                    setUserSex(userDataParsed.sex);
                    setUserAge(userDataParsed.body.age);
                    setUserWeight(userDataParsed.body.weight);
                    setUserHeight(userDataParsed.body.height);
                    setUserBMI(userDataParsed.body.BMI)
                    setUserAttributes(userDataParsed.attributes);
                    setDailyIntake(userDataParsed.macronutrientIntake);
                    setUserWeightTarget(userDataParsed.weightTarget);
                    setUserPhysicalActivity(userDataParsed.physicalActivity);
                }

            }else
            {
                setIsUserNew(true);
                console.log('Brak zapisanego użytkownika, tworzenie nowego.')
                console.log('');
                const newUser = {
                    name: 'Anonim',
                    newUser: true,
                    sex: 'male',
                    body: {
                        age: 0,
                        weight: 0,
                        height: 0,
                        BMI: 0
                    },
                    weightTarget: 0,
                    physicalActivity: 0,
                    macronutrientIntake: nutrientConstants.startingMacroIntake,
                    attributes: startingAttributes
                };
                await AsyncStorage.setItem('userData', JSON.stringify(newUser));

            }

            console.log('ZAŁADOWANO DANE UŻYTKOWNIKA');
            console.log('');
            setUserDataLoaded(true);
            
        }catch (error){
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchUserData();   
    }, []); 

    const calculateDailyIntake = async (sex, age, weight, height, weightTarget, physicalActivity) => {
        try {

            console.log('Obliczanie zapotrzebowania dla podanych wartości: \n',
                        'Płeć: ', sex,
                        ' Wiek: ', age,
                        ' Waga: ', weight,
                        ' Wzrost: ', height,
                        ' Zmiana wagi na tydzień: ', weightTarget,
                        ' Aktywność fizyczna: ', physicalActivity);

            const userData = await AsyncStorage.getItem('userData');
            if(userData){
                const baseCaloricIntake = 10 * weight + 6.25 * height - 5 * age;
                console.log('Podstawowe zapotrzebowanie kaloryczne ', baseCaloricIntake);

                const newBMI = height > 0 ? weight / Math.pow(height/100, 2) : 0;

                const parsedData = JSON.parse(userData);

                const sexCaloricIntake = sex === 'male' ? baseCaloricIntake + 5 : baseCaloricIntake - 161;

                console.log('Zapotrzebowanie kaloryczne z uwzględnieniem płci ', sexCaloricIntake);

                const physicalActivityCaloricIntake = sexCaloricIntake * (1.2 + physicalActivity * 0.175);

                console.log('Zapotrzebowanie kaloryczne z uwzględnieniem aktywności fizycznej ', physicalActivityCaloricIntake);

                const weightTargetCaloricIntake = Math.max(0, physicalActivityCaloricIntake + (weightTarget * 1100));

                console.log('Zapotrzebowanie kaloryczne z uwzględnieniem celu zmiany masy ciała ', weightTargetCaloricIntake);

                const proteinIntake  = [weightTargetCaloricIntake * 0.1 / 4, weightTargetCaloricIntake * 0.2 / 4];
                const carbohydratesIntake  = [weightTargetCaloricIntake * 0.45 / 4, weightTargetCaloricIntake * 0.7 / 4];
                const fatIntake  = [weightTargetCaloricIntake * 0.25 / 9, weightTargetCaloricIntake * 0.3 / 9];


                if(parsedData.newUser){
                    parsedData.newUser = false;
                }
                
                parsedData.sex = sex;
                parsedData.body.age = age;
                parsedData.body.weight = weight;
                parsedData.body.height = height;
                parsedData.weightTarget = weightTarget;
                parsedData.physicalActivity = physicalActivity;
                parsedData.macronutrientIntake.dailyCaloricIntake = weightTargetCaloricIntake;
                parsedData.macronutrientIntake.dailyProteinIntake = proteinIntake;
                parsedData.macronutrientIntake.dailyCarbohydratesIntake = carbohydratesIntake;
                parsedData.macronutrientIntake.dailySugarIntake = weightTargetCaloricIntake * 0.1 / 4;
                parsedData.macronutrientIntake.dailyFatIntake = fatIntake;
                parsedData.macronutrientIntake.dailySaturatedFatIntake = weightTargetCaloricIntake * 0.1 / 9;
                parsedData.macronutrientIntake.dailyMonoUnsaturatedFatIntake = weightTargetCaloricIntake * 0.2 / 9;
                parsedData.macronutrientIntake.dailyPolyUnsaturatedFatIntake = weightTargetCaloricIntake * 0.1 / 9;
                parsedData.body.BMI = newBMI;

                setDailyIntake(parsedData.macronutrientIntake);
                setUserBMI(newBMI);
                setIsUserNew(false);

                await AsyncStorage.setItem('userData', JSON.stringify(parsedData));
            }
        } catch (error) {
            console.log(error);
        }
    } 

    const memoizedValues = useMemo(() => {
        return {
            username,
                userAge, setUserAge,
                userWeight, setUserWeight,
                userHeight, setUserHeight,

                userWeightTarget, setUserWeightTarget,
                userPhysicalActivity, setUserPhysicalActivity,

                dailyIntake, calculateDailyIntake,

        }
    },[username,userAge, setUserAge,
        userWeight, setUserWeight,
        userHeight, setUserHeight,
        userWeightTarget, setUserWeightTarget,
        userPhysicalActivity, setUserPhysicalActivity,
        dailyIntake,
        ])

    return (
        <UserDataContext.Provider
            value={memoizedValues}
        >

            {children}

        </UserDataContext.Provider>
    )
}
