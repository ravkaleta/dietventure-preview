import { createContext, useState, useContext, memo, useMemo } from "react";
import { getCurrentDayInfo } from "../utils/dateUtils";
import { nutrients } from "../constants/nutrients";
import { useWindowDimensions, StatusBar } from "react-native";
import { dimensions } from "../styles/global";
import { useSharedValue } from "react-native-reanimated";
import startingAttributes from "../constants/startingAttributes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadedDataUserContext = createContext();
const LoadedDataFoodContext = createContext();
const LoadedDataGameContext = createContext();

const UserBMIContext = createContext();
const UserSexContext = createContext();

const UserAttributesContext = createContext();
const NewUserContext = createContext();

const SelectedDayContext = createContext();
const SelectedDayNutrientsContext = createContext();

const CurrentDayInfoContext = createContext();
const CurrentDayCaloriesContext = createContext();
const TrainingsContext = createContext();

const SliderAnimationContext = createContext();

const CharacterStatsContext = createContext();
const GameLogsContext = createContext();
const CurrentEnergyContext = createContext();
const CurrentHealthContext = createContext();
const UserGoldContext = createContext();

export const useUserAttributes = () => useContext(UserAttributesContext);
export const useNewUser = () => useContext(NewUserContext);

export const useUserLoadedData = () => useContext(LoadedDataUserContext);
export const useFoodLoadedData = () => useContext(LoadedDataFoodContext);
export const useGameLoadedData = () => useContext(LoadedDataGameContext);

export const useUserBMI = () => useContext(UserBMIContext);
export const useUserSex = () => useContext(UserSexContext);

export const useSelectedDay = () => useContext(SelectedDayContext);
export const useSelectedDayNutrients = () => useContext(SelectedDayNutrientsContext);
export const useCurrentDayInfo = () => useContext(CurrentDayInfoContext);
export const useCurrentDayCalories = () => useContext(CurrentDayCaloriesContext);
export const useSliderAnimation = () => useContext(SliderAnimationContext);

export const useCharacterStats = () => useContext(CharacterStatsContext);
export const useGameLogs = () => useContext(GameLogsContext);
export const useCurrentEnergy = () => useContext(CurrentEnergyContext);
export const useCurrentHealth = () => useContext(CurrentHealthContext);
export const useUserGold = () => useContext(UserGoldContext);
export const useTrainings = () => useContext(TrainingsContext);


export function CommonDataProvider({children}) {

    console.log('0')
    //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', useWindowDimensions().height);
    //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', StatusBar.currentHeight);

    const statusBarHeight = StatusBar.currentHeight < 35 ? StatusBar.currentHeight : 0;

    const {width, height} = useWindowDimensions();
    const screensHeight = height * dimensions.mainWindowHeight - 65 - statusBarHeight;

    const lastTranslateY_Stats = useSharedValue(0);
    const charAttrHeight = useSharedValue(screensHeight);


    return(
            <LoadedDataUserProvider>
            <LoadedDataFoodProvider>
            <LoadedDataGameProvider>
            <UserSexProvider>
            <UserBMIProvider>
            <UserAttributesProvider>
            <NewUserProvider>

                <SelectedDayProvider>
                <SelectedDayNutrientsProvider>

                    <CurrentDayInfoProvider>
                    <CurrentDayCaloriesProvider>
                    <TrainingsProvider>

                        <CharacterStatsProvider>
                        <GameLogsProvider>
                        <CurrentEnergyProvider>
                        <CurrentHealthProvider>
                        <UserGoldProvider>

                                    <SliderAnimationContext.Provider value = {{screensHeight, lastTranslateY_Stats, charAttrHeight}}>
                                        {children}
                                    </SliderAnimationContext.Provider>

                        </UserGoldProvider>
                        </CurrentHealthProvider>
                        </CurrentEnergyProvider>
                        </GameLogsProvider>
                        </CharacterStatsProvider>

                    </TrainingsProvider>
                    </CurrentDayCaloriesProvider>
                    </CurrentDayInfoProvider>

                </SelectedDayNutrientsProvider>
                </SelectedDayProvider>

            </NewUserProvider>
            </UserAttributesProvider>
            </UserBMIProvider>
            </UserSexProvider>
            </LoadedDataGameProvider>
            </LoadedDataFoodProvider>
            </LoadedDataUserProvider>
            
    )
}

function LoadedDataUserProvider ({children}) {
    console.log('1a')

    const [userDataLoaded, setUserDataLoaded] = useState(false);

    return (
        <LoadedDataUserContext.Provider value = {{userDataLoaded, setUserDataLoaded}}>
            {children}
        </LoadedDataUserContext.Provider>
    )
}

function LoadedDataFoodProvider ({children}) {
    console.log('1b')

    const [foodDataLoaded, setFoodDataLoaded] = useState(false);

    return (
        <LoadedDataFoodContext.Provider value = {{foodDataLoaded, setFoodDataLoaded}}>
            {children}
        </LoadedDataFoodContext.Provider>
    )
}

function LoadedDataGameProvider ({children}) {
    console.log('1c')

    const [gameDataLoaded, setGameDataLoaded] = useState(false);

    return (
        <LoadedDataGameContext.Provider value = {{gameDataLoaded, setGameDataLoaded}}>
            {children}
        </LoadedDataGameContext.Provider>
    )
}

function UserBMIProvider ({children}) {

    const [userBMI, setUserBMI] = useState(20);

    return(
        <UserBMIContext.Provider value={{userBMI, setUserBMI}}>
            {children}
        </UserBMIContext.Provider>
    )
}

function UserSexProvider ({children}) {

    const [userSex, setUserSex] = useState('male');

    return(
        <UserSexContext.Provider value={{userSex, setUserSex}}>
            {children}
        </UserSexContext.Provider>
    )
}


function UserAttributesProvider ({children}) {
    console.log('0');

    const [ userAttributes, setUserAttributes] = useState(startingAttributes);

    return (
        <UserAttributesContext.Provider value = {{userAttributes, setUserAttributes}}>
            {children}
        </UserAttributesContext.Provider>
    )
}

function NewUserProvider ({children}) {
    console.log('0a');

    const [ isUserNew, setIsUserNew] = useState(false);

    return  (
        <NewUserContext.Provider value = {{isUserNew, setIsUserNew}}>
            {children}
        </NewUserContext.Provider>
    )
}


function SelectedDayProvider ({children}) {

    console.log('2')

    const currentDate = new Date();
    const currentDayInfo = getCurrentDayInfo(currentDate);


    const [selectedDay, setSelectedDay] = useState(currentDayInfo);

    return (
        <SelectedDayContext.Provider value = {{selectedDay, setSelectedDay}}>
            {children}
        </SelectedDayContext.Provider>
    )
}

function SelectedDayNutrientsProvider ({children}) {
    console.log('3')

    const [selectedDayNutrients, setSelectedDayNutrients] = useState(nutrients);

    return (
        <SelectedDayNutrientsContext.Provider value = {{selectedDayNutrients, setSelectedDayNutrients}}>
            {children}
        </SelectedDayNutrientsContext.Provider>
    )
}

function CurrentDayInfoProvider ({children}) {
    console.log('4')

    const currentDate = new Date();
    const currentDayInfo = getCurrentDayInfo(currentDate);

    return (
        <CurrentDayInfoContext.Provider value = {{currentDayInfo}}>
            {children}
        </CurrentDayInfoContext.Provider>
    )
}

function CurrentDayCaloriesProvider ({children}) {
    console.log('5')

    const [todayCalories, setTodayCalories] = useState(null);

    return (
        <CurrentDayCaloriesContext.Provider value = {{todayCalories, setTodayCalories}}>
            {children}
        </CurrentDayCaloriesContext.Provider>
    )
}

function TrainingsProvider ({children}) {
    console.log('5');

    const [cardioDone, setCardioDone] = useState(false);
    const [strengthDone, setStrengthDone] = useState(false);

    return (
        <TrainingsContext.Provider value = {{cardioDone, setCardioDone, strengthDone, setStrengthDone}}>
            {children}
        </TrainingsContext.Provider>
    )
}


function CharacterStatsProvider ({children}) {

    const [maxHealth, setMaxHealth] = useState(100);
    const [maxEnergy, setMaxEnergy] = useState(100);

    const baseDamage = [2,4];
    const [characterDamage, setCharacterDamage] = useState(baseDamage);

    const [hpRegenRate, setHpRegenRate] = useState(1000);
    const [newEventRate, setNewEventRate] = useState(2000);

    return (
        <CharacterStatsContext.Provider value={{maxHealth, setMaxHealth,
                                                maxEnergy, setMaxEnergy,
                                                baseDamage,
                                                characterDamage, setCharacterDamage,
                                                hpRegenRate, setHpRegenRate,
                                                newEventRate, setNewEventRate }}>
            {children}
        </CharacterStatsContext.Provider>
    )
}

function GameLogsProvider ({children}) {
    console.log('6a');

    const [ gameLogs, setGameLogs] = useState([]);

    return (
        <GameLogsContext.Provider value = {{ gameLogs, setGameLogs}}>
            {children}
        </GameLogsContext.Provider>
    )
}

function CurrentEnergyProvider ({children}) {
    console.log('7');

    const [currentEnergy, setCurrentEnergy] = useState(0);

    return (
        <CurrentEnergyContext.Provider value = {{ currentEnergy, setCurrentEnergy }}>
            {children}
        </CurrentEnergyContext.Provider>
    ) 
}

function CurrentHealthProvider ({children}) {
    console.log('8');

    
    const [currentHealth, setCurrentHealth] = useState(100);

    return (
        <CurrentHealthContext.Provider value = {{ currentHealth, setCurrentHealth }}>
            {children}
        </CurrentHealthContext.Provider>
    ) 
}

function UserGoldProvider ({children}) {
    console.log('9');



    const [gold, setGold] = useState(0);

    const updateGold = async(value) => {
        const userGold = await AsyncStorage.getItem('userGold');
        const userGoldParsed = userGold ? parseInt(userGold, 10) : null;

        if(userGoldParsed){
            const newGoldValue = userGoldParsed + value;
            //console.log(newGoldValue);
            setGold(newGoldValue);
            await AsyncStorage.setItem('userGold', newGoldValue.toString());
        } else {
            setGold(value);
            await AsyncStorage.setItem('userGold', value.toString());
        }

        
    }

    return (
        <UserGoldContext.Provider value = {{ gold, setGold, updateGold }}>
            {children}
        </UserGoldContext.Provider>
    )
}



