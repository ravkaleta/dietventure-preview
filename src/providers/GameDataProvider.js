import React, {createContext, useContext, useState, useEffect, useRef, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



import * as dateUtils from '../utils/dateUtils';
import { useUserData } from './UserDataProvider';
import { useCurrentDayCalories, useCurrentEnergy, useCurrentHealth, useUserLoadedData, useUserAttributes, useUserGold, useGameLoadedData, useGameLogs, useFoodLoadedData, useCharacterStats } from './CommonDataProvider';
import { addGameEvent, addGameLogsToStorage, getEventById } from '../utils/addGameEvent';
import { months } from '../constants/calendar';

const GameDataContext = createContext();

export function useGameData() {
    return useContext(GameDataContext);
}

export function GameDataProvider({children}) {
    console.log('GameData load');

    const { dailyIntake } = useUserData();

    const { todayCalories } = useCurrentDayCalories();

    const { userAttributes } = useUserAttributes();
    const { userDataLoaded } = useUserLoadedData();

    const { foodDataLoaded } = useFoodLoadedData();
    const { gameDataLoaded, setGameDataLoaded } = useGameLoadedData();
    const { gameLogs, setGameLogs} = useGameLogs();

    const { setGold, updateGold } = useUserGold();
    const { setCurrentEnergy } = useCurrentEnergy();
    const { currentHealth, setCurrentHealth } = useCurrentHealth();

    const { maxHealth, setMaxHealth,
        maxEnergy, setMaxEnergy,
        baseDamage,
        characterDamage, setCharacterDamage,
        hpRegenRate, setHpRegenRate,
        newEventRate, setNewEventRate } = useCharacterStats();

    const timeToExhaust = useRef(0);
    const journeyTime = useRef(0);
    const isExhausted = useRef(false);

    const [gameDataFetched, setGameDataFetched] = useState(false);
    const [gameLogsFetched, setGameLogsFetched] = useState(false);

    const [gameUpdated, setGameUpdated] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);


    const [currentEnemy, setCurrentEnemy] = useState(null);
    const [currentEncounter, setCurrentEncounter] = useState(null);

    const [energyUsageRate, setEnergyUsageRate] = useState(4000);
    
    const [lastUsedEnergyUpdate, setLastUsedEnergyUpdate] = useState(0);

    const currentDate = new Date();

    const fetchGameData = async () => {
        try {

            const userGold = await AsyncStorage.getItem('userGold');
            const userGoldParsed = userGold ? parseInt(userGold, 10) : null;

            console.log('SPRAWDZANIE ZAPISANYCH DANYCH O ZŁOCIE UŻYTKOWNIKA')
            if(userGoldParsed){
                console.log('Dane o złocie są już w AsyncStorage.');
                setGold(userGoldParsed);
                console.log('');
            }else{
                console.log('Brak danych o złocie w AsyncStorage. Zostaną one dodane.');
                await AsyncStorage.setItem('userGold', '0');
                console.log('');
            }
            
            const userMaxHP = 100 + 25 * (Math.floor(userAttributes.vitality.value) - 1);
            setMaxHealth(userMaxHP);

            const userMaxEnergy = 100;
            setMaxEnergy(userMaxEnergy);

            const userDamage = [baseDamage[0] * Math.floor(userAttributes.strength.value) ,baseDamage[1] * Math.floor(userAttributes.strength.value)];
            setCharacterDamage(userDamage);

            const dayMiliseconds = 24 * 60 * 60 * 1000;
            

            setEnergyUsageRate(dayMiliseconds/dailyIntake.dailyCaloricIntake);
            setHpRegenRate(60000 / Math.floor(userAttributes.regeneration.value));


            const eventsPerFourHours = 10 + 2 * userAttributes.endurance.value;
            const milisecondsInFourHours = 4 * 60 * 60 * 1000;

            setNewEventRate(milisecondsInFourHours/eventsPerFourHours);
   
             

            setGameDataFetched(true);

        } catch (error) {
            console.log(error);
        }
    }

    const checkForGameUpdates = async () => {

        console.log('Energy usage rate: ', energyUsageRate,
         '\n HP Regen rate: ', hpRegenRate,
         '\n New Event rate: ', newEventRate,
         '\n MAX health: ', maxHealth,
         '\n character Damage', characterDamage);


        await checkForEnergyUpdates();
        await checkForGameLogsUpdate();


        setGameUpdated(true);
        setGameDataLoaded(true);
    }

    const handleTodayCaloriesChange = async() => {
        console.log('Nastąpiła zmiana w wartościach odżywczych, aktualizuję datę zużytej energii.')
        const energyUsed = await AsyncStorage.getItem('characterUsedEnergy');
        const energyUsedParsed = energyUsed ? JSON.parse(energyUsed) : null;

        if(energyUsedParsed){
            console.log('Stary odczyt z energyUsedParsed', energyUsedParsed);
            const newDate = new Date();
            const newEnergyUsed = Math.min(todayCalories, energyUsedParsed.value);
            console.log('Nowe dane dla energyUsed', newDate, newEnergyUsed);
            updateEnergy(newEnergyUsed, newDate);
        }else {
            console.log('COŚ POSZŁO NIE TAK. Brak danych o energii w AsyncStorage. Zostaną one dodane.');
            await addEnergyToStorage();
        }
    }

    useEffect(() => {
        if(userDataLoaded){
            fetchGameData();
        }
    }, [userDataLoaded, userAttributes])

    useEffect(() => {
        if(gameDataFetched){
            checkForGameUpdates();
        }
    }, [gameDataFetched])

    useEffect(() => {

        const fetchHealthData = async () => {
            if(gameLogsFetched){
                if(!gameStarted){
                    checkForHealthUpdates();
                } else {
                    const health = await AsyncStorage.getItem('characterHealth');
                    const healthParsed = health ? JSON.parse(health) : null;

                    if(healthParsed){
                        setCurrentHealth(healthParsed.value)
                    } else {
                        console.log('Brak danych o punktach życia w AsyncStorage. Zostaną one dodane.');
                        await addHealthToStorage(userAttributes.vitality.value);
                    }
                }
            }
        }
        


        fetchHealthData();

    }, [gameLogsFetched, gameStarted])


    //POBIERANIE DANYCH DLA GRY
    useEffect(() => {
        if(todayCalories != null && gameDataFetched && gameUpdated){
            handleTodayCaloriesChange();
        }
    }, [todayCalories, gameDataFetched, gameUpdated]); 

    //INTERWAŁ DLA REGENERACJI ŻYCIA
    useEffect(() => {
        let intervalHpRegen;
        console.log('INTERWAŁ ŻYCIA');

        if(!gameStarted && gameDataFetched && gameUpdated){
            intervalHpRegen = setInterval(() => {
                if(currentHealth < maxHealth){
                    const currDate = new Date;
                    const newHealth = Math.min(currentHealth + 1, maxHealth);
                    updateHealth(newHealth, currDate);
                }
            }, hpRegenRate)
        }

        return () => clearInterval(intervalHpRegen);
    }, [gameStarted, currentHealth, gameDataFetched, gameUpdated]); 

    //INTERWAŁ DLA ZUŻYCIA ENERGII
    useEffect(() => {
        let intervalUsedEnergy;


        if(gameDataFetched && gameUpdated){
            intervalUsedEnergy = setInterval(() => {
                //console.log('todayCalories: ', todayCalories)
                console.log('INTERWAŁ ENERGII');
                if(todayCalories > 0 && lastUsedEnergyUpdate < todayCalories){
                    //console.log(lastUsedEnergyUpdateRef.current.value);
                    const currDate = new Date;
                    const newEnergy = lastUsedEnergyUpdate + 1;
                    updateEnergy(newEnergy, currDate);
    
                }
            }, energyUsageRate)
        }

        return () => {
            clearInterval(intervalUsedEnergy);
        }
    }, [lastUsedEnergyUpdate, todayCalories, gameDataFetched, gameUpdated]);

    
    const updateEnergy = (value, date) => {
        console.log('Aktualizacja energii')
        const formattedDate = date.toISOString();
        setLastUsedEnergyUpdate(value);
        const energyData = {
            value: value,
            lastUpdateDate: formattedDate
        };

        AsyncStorage.setItem('characterUsedEnergy', JSON.stringify(energyData));

        const staminaPercentage = Math.max(0, (todayCalories - value) / dailyIntake.dailyCaloricIntake * 100);
        const staminaFixed = staminaPercentage.toFixed(2);
        setCurrentEnergy(staminaFixed);
    }

    const updateHealth = async (value, date) => {
        console.log('Aktualizacja życia')
        const formattedDate = date.toISOString();

        const healthData = {
            value: value,
            lastUpdateDate: formattedDate
        }
        const healthDataSerialized = JSON.stringify(healthData);

        await AsyncStorage.setItem('characterHealth', healthDataSerialized);
        setCurrentHealth(value);
    }

    const addHealthToStorage = async (vitalityLevel) => {
        const currentDate = new Date;
        const formattedDate = currentDate.toISOString();

        const healthData = {
            value: 100 * vitalityLevel,
            lastUpdateDate: formattedDate
        }

        const healthDataSerialized = JSON.stringify(healthData);

        await AsyncStorage.setItem('characterHealth', healthDataSerialized);
    }

    const addEnergyToStorage = async() => {
        const currentDate = new Date;
        const formattedDate = currentDate.toISOString();

        const energyData = {
            value: 0,
            lastUpdateDate: formattedDate
        }

        const energyDataSerialized = JSON.stringify(energyData);

        await AsyncStorage.setItem('characterUsedEnergy', energyDataSerialized);
    }

    const checkForGameLogsUpdate = async() => {

        const lastGameLogsUpdate = await AsyncStorage.getItem('gameLogs');
        const lastGameLogsUpdateParsed = lastGameLogsUpdate ? JSON.parse(lastGameLogsUpdate) : null;

        if(lastGameLogsUpdateParsed){
            console.log(lastGameLogsUpdateParsed);
            //setGameLogs(lastGameLogsUpdateParsed.gameLogs);
            if(lastGameLogsUpdateParsed.gameStarted){
                console.log('Gra była włączona, obliczanie czasu od ostatniej aktualizacji');

                console.log('Czas podróży do wyczerpania', timeToExhaust.current);

                
                if(isExhausted.current){
                    journeyTime.current = timeToExhaust.current;
                } else {
                    console.log('Obliczanie czasu od ostatniego wydarzenia');
                    const currentDate = new Date();
                    const lastGameLogDate = new Date(lastGameLogsUpdateParsed.date);

                    journeyTime.current = dateUtils.getTimePassed(currentDate, lastGameLogDate);
                }


                console.log('Czas podróży od ostatniej aktualizacji', journeyTime.current);
                console.log('Czy energia została wyczerpana :', isExhausted.current);

                console.log('Dane przed wyjściem z aplikacji: ', lastGameLogsUpdateParsed);

                const eventsToGenerate = Math.floor(journeyTime.current / newEventRate);

                console.log('Zdarzenia do wygenerowania: ', eventsToGenerate);

                let userRemainingHP = lastGameLogsUpdateParsed.lastSavedHealthValue;
                let lastEnemy = lastGameLogsUpdateParsed.lastEnemy;
                let lastEncounter = lastGameLogsUpdateParsed.lastEncounter;
                let totalGainedGold = 0;
                const generatedEvents = lastGameLogsUpdateParsed.gameLogs;
                let gameStarted = !isExhausted.current;
                let endingEvent = isExhausted.current ? 3 : null;

                //const lastGameLogsUpdateDate = new Date(lastGameLogsUpdateParsed.date);
                let newLastGameLogsUpdateDate = new Date(lastGameLogsUpdateParsed.date)


                for(let i = 1; i <= eventsToGenerate; i++){

                    if(userRemainingHP > 0 ){
                        const { userHP, isEnemy, isEncounter, gainedGold, eventTitle, gameEventText, encounterLogs } = addGameEvent(userRemainingHP, maxHealth, userAttributes, characterDamage, lastEnemy, lastEncounter);
                        userRemainingHP = userHP;
                        lastEnemy = isEnemy;
                        lastEncounter = isEncounter;
                        totalGainedGold += gainedGold;

                        const newEventDateOffset = newLastGameLogsUpdateDate.getTime() + newEventRate;
                        newLastGameLogsUpdateDate = new Date(newEventDateOffset);

                        const dateString = `${newLastGameLogsUpdateDate.getDate()} ${months[newLastGameLogsUpdateDate.getMonth()]} ${newLastGameLogsUpdateDate.getHours()}:${newLastGameLogsUpdateDate.getMinutes()}:${newLastGameLogsUpdateDate.getSeconds()}`;

                        const gameEvent = {
                            date: newLastGameLogsUpdateDate.toISOString(),
                            title: eventTitle,
                            text: gameEventText,
                            encounterLogs: encounterLogs,
                            expanded: false
                        }

                        generatedEvents.push(gameEvent);

                    } else {
                        gameStarted = false;
                        endingEvent = 2;
                        break;
                    }
                }

                if(endingEvent){
                    if(endingEvent == 3){
                        const previousLastGameLogDate = new Date(lastGameLogsUpdateParsed.date);
                        const newEventDateOffset = previousLastGameLogDate.getTime() + timeToExhaust.current;
                        newLastGameLogsUpdateDate = new Date(newEventDateOffset);
                    } 

                    const oneSecondOffset = newLastGameLogsUpdateDate.getTime() + 1000;
                    newLastGameLogsUpdateDate = new Date(oneSecondOffset);
                    
                    const event = getEventById(endingEvent)

                    const gameEvent = {
                        date: newLastGameLogsUpdateDate.toISOString(),
                        title: event.title,
                        text: event.description,
                        encounterLogs: [],
                    }
                    generatedEvents.push(gameEvent);
                }

                console.log('Dane po generowaniu \n userRemainingHP: ', userRemainingHP,
                 'lastEnemy', lastEnemy, 'lastEncounter', lastEncounter, 'totalGainedGold ', totalGainedGold, '\n logi: ', generatedEvents);

                const eventsSorted = [...generatedEvents].sort((a,b) => new Date(b.date) - new Date(a.date));
                console.log('POSORTOWANE EVENTY: ', eventsSorted);

                await updateHealth(userRemainingHP, newLastGameLogsUpdateDate);
                setCurrentEnemy(lastEnemy);
                setCurrentEncounter(lastEncounter);
                updateGold(totalGainedGold);
                setGameLogs(eventsSorted);
                setGameStarted(gameStarted);

                

                await addGameLogsToStorage(gameStarted, newLastGameLogsUpdateDate, userRemainingHP, generatedEvents, lastEnemy, lastEncounter);

            } else {
                console.log('Gra nie była włączona');
            }
        } else {
            console.log('Nie znaleziono gameLogs w AsyncStorage');
        }

        setGameLogsFetched(true);

    }

    const checkForHealthUpdates = async () => {
        const health = await AsyncStorage.getItem('characterHealth');
        const healthParsed = health ? JSON.parse(health) : null;

        console.log('SPRAWDZANIE PUNKTÓW ŻYCIA UŻYTKOWNIKA');
        if(healthParsed){
            console.log('Dane o punktach życia znajdują się już w AsyncStorage.');
            if(healthParsed.value < maxHealth){
                console.log('Ostatni zapis: ', healthParsed )
                const currentDate = new Date();
                const currentDateReset = dateUtils.resetTime(new Date());
                const lastUpdateDate = new Date(healthParsed.lastUpdateDate);
                const lastUpdateReset = dateUtils.resetTime(lastUpdateDate);
                const dayDifference = dateUtils.compareDates(currentDateReset, lastUpdateReset);

                console.log('current date: ', currentDate);
                console.log('Ilość dni od ostatniej aktualizacji: ', dayDifference);
                if(dayDifference < 2){
                    console.log('Minął mniej niż dzień, obliczamy nową wartość dla punktów życia');
                    const timePassed = dateUtils.getTimePassed(currentDate, healthParsed.lastUpdateDate);
                    console.log('Czas od ostatniej aktualizacji ', timePassed, 'ms');
                    const newHealth = Math.min(healthParsed.value + Math.floor(timePassed / hpRegenRate), maxHealth);
                    console.log('Nowa wartość dla punktów życia: ', newHealth);
                    updateHealth(newHealth, currentDate);
                } else {
                    console.log('Minął ponad dzień, punkty życia wracają do maksymalnej wartości.')
                    updateHealth(maxHealth, currentDate);
                }

            }else{
                console.log('Dane aktualne.');
                updateHealth(maxHealth, currentDate);
            }
        }else{
            console.log('Brak danych o punktach życia w AsyncStorage. Zostaną one dodane.');
            await addHealthToStorage(userAttributes.vitality.value);
        }
        console.log('');
    }

    const checkForEnergyUpdates = async () => {
        const energyUsed = await AsyncStorage.getItem('characterUsedEnergy');
        const energyUsedParsed = energyUsed ? JSON.parse(energyUsed) : null;

        const todayNutrients = await AsyncStorage.getItem('lastSavedNutrients');
        const todayNutrientsParsed = todayNutrients ? JSON.parse(todayNutrients) : null;


        console.log('SPRAWDZANIE ZUŻYCIA ENERGII UŻYTKOWNIKA')
        if(energyUsedParsed){
            console.log('Dane o energii znajdują się już w AsyncStorage.');
            console.log(energyUsedParsed);
            console.log('Ostatni zapis: ', energyUsedParsed);
            const currentDate = new Date();
            const currentDateReset = dateUtils.resetTime(new Date());
            const lastUpdateDate = new Date(energyUsedParsed.lastUpdateDate);
            const lastUpdateReset = dateUtils.resetTime(lastUpdateDate);
            const dayDifference = dateUtils.compareDates(currentDateReset, lastUpdateReset);
            let timePassed = 0;

            console.log('Ilość dni od ostatniej aktualizacji: ', dayDifference);
            if(dayDifference < 2){
                console.log('Minął mniej niż dzień, obliczamy nową wartość dla zużycia energii');
                if(todayNutrientsParsed){
                    console.log('Aktualna data', currentDate.toISOString());
                    timePassed = dateUtils.getTimePassed(currentDate, energyUsedParsed.lastUpdateDate);
                    console.log('Czas od ostatniej aktualizacji ', timePassed, 'ms');
                    console.log('total calories', todayNutrientsParsed.nutrients.totalCalories)
                    const newEnergyUsed = Math.min(energyUsedParsed.value + Math.floor(timePassed / energyUsageRate), todayNutrientsParsed.nutrients.totalCalories);
                    console.log('Sprawdzenie czy energia zdążyła się wyczerpać.');
                    if(newEnergyUsed === todayNutrientsParsed.nutrients.totalCalories){
                        console.log('Energia została wyczerpana. Obliczanie czasu, który był potrzebny do wyczerpania.');
                        console.log('Kalorie: ', todayNutrientsParsed.nutrients.totalCalories, 'Zużyta energia: ', energyUsedParsed.value);
                        const remainingEnergy = todayNutrientsParsed.nutrients.totalCalories - energyUsedParsed.value;
                        const toExhaust = remainingEnergy * energyUsageRate;
                        timeToExhaust.current = toExhaust;
                        isExhausted.current = true;
                    } else {
                        console.log('Energia nie została wyczerpana');
                        isExhausted.current = false;
                    }
                    console.log('Nowa wartość dla zużycia energii', newEnergyUsed);
                    updateEnergy(newEnergyUsed, currentDate);
                } else {
                    console.log('Nie udało się pobrać ostatnich zapisanych wartości odżywczych. Resetowanie zużycia energii');
                    updateEnergy(0, currentDate);
                }
            } else {
                console.log('Minął ponad dzień, zużycie energii zostaje wyzerowana.')
                console.log('Obliczanie czasu, który był potrzebny do wyczerpania.');
                console.log('Kalorie: ' , todayNutrientsParsed.nutrients.totalCalories, 'Zużyta energia: ', energyUsedParsed.value)
                const remainingEnergy = todayNutrientsParsed.nutrients.totalCalories - energyUsedParsed.value;
                const toExhaust = remainingEnergy * energyUsageRate;
                timeToExhaust.current = toExhaust;
                isExhausted.current = true;
                updateEnergy(0, currentDate);
            }
        }else{
            console.log('Brak danych o energii w AsyncStorage. Zostaną one dodane.');
            await addEnergyToStorage();
        }
        console.log('');
    }

    const memoizedValues = useMemo(() => {
        return {
            gameStarted, setGameStarted,
            updateHealth,
            currentEnemy, setCurrentEnemy,
            currentEncounter, setCurrentEncounter
        }
    }, [gameStarted, setGameStarted, currentEnemy, setCurrentEnemy, currentEncounter, setCurrentEncounter])

    return (
        <GameDataContext.Provider
            value={ memoizedValues }
        >
            {children}

        </GameDataContext.Provider>
    )
}
