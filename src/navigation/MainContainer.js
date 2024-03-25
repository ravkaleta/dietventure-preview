import {View, StyleSheet, Image, StatusBar, Dimensions, useWindowDimensions } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React ,{useEffect, useState} from 'react';

import { colors, dimensions } from '../styles/global';
import CharacterScreen from './screens/CharacterScreen';
import MealsScreen from './screens/MealsScreen';
import GameScreen from './screens/GameScreen';
import SettingsScreen from './stackScreens/SettingsScreen';
import ProductSearch from './stackScreens/ProductSearch';
import SettingsCategory from './stackScreens/SettingsCategory';
import LoadingScreen from './screens/LoadingScreen';
import { useFoodLoadedData, useGameLoadedData, useNewUser, useUserLoadedData } from '../providers/CommonDataProvider';
import NewUserScreen from './screens/NewUserScreen';

const characterName = 'Character';
const menuName = 'Meals';
const gameName = 'Game';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const characterIcon = require('../assets/images/characterIcon.png');
const mealsIcon = require('../assets/images/mealsIcon.png');
const gameIcon = require('../assets/images/gameIcon.png');

const characterIcon_Active = require('../assets/images/characterIcon_active.png');
const mealsIcon_Active = require('../assets/images/mealsIcon_active.png');
const gameIcon_Active = require('../assets/images/gameIcon_active.png');

function MainScreens() {
    console.log('MainContainer render')
    const windowHeight = useWindowDimensions().height;

    return (
        <Tab.Navigator
                initialRouteName={characterName}
                screenOptions={({route}) => ({
                    tabBarStyle: [styles.bottomTab, {height: windowHeight * dimensions.bottomTabHeight}],
                    tabBarLabelStyle: styles.screenName,
                    tabBarActiveTintColor: colors.YELLOW_WHITE,
                    tabBarInactiveTintColor: colors.backgroundColor,
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let rn = route.name;
                        let iconHeight = '100%'

                        if (rn === characterName) {
                            iconName = focused ? characterIcon_Active : characterIcon
                        } else if (rn === menuName) {
                            iconName = focused ? mealsIcon_Active : mealsIcon
                        } else if (rn === gameName) {
                            iconName = focused ? gameIcon_Active : gameIcon
                            iconHeight = '140%';
                        }

                        return <Image source={iconName} style={[styles.icons,{height: iconHeight}]}/>;
                    }
                })}>
                <Tab.Screen name={menuName} component={MealsScreen} options={{headerShown: false}} />
                <Tab.Screen name={characterName} component={CharacterScreen} options={{headerShown: false}}/>
                <Tab.Screen name={gameName} component={GameScreen} options={{headerShown: false}}/>
                
            </Tab.Navigator>
    )
}

export default function MainContainer() {

    const [isLoading, setIsLoading ] = useState(true);

    const { userDataLoaded } = useUserLoadedData();
    const { foodDataLoaded } = useFoodLoadedData();
    const { gameDataLoaded } = useGameLoadedData();
    const { isUserNew } = useNewUser();

    useEffect(() => {
        if(userDataLoaded){
            console.log('User ✓')
        }

        if(gameDataLoaded){
            console.log('Game ✓')
        }

        if(foodDataLoaded){
            console.log('Food ✓')
        }

        

        if(userDataLoaded && gameDataLoaded && foodDataLoaded){
            setIsLoading(false);
        }

        
    }, [userDataLoaded, foodDataLoaded, gameDataLoaded ])

    if(isLoading){
        return <LoadingScreen/>
    }

    if(isUserNew){    
        return <NewUserScreen/>
    }


    return(
        <View style={{flex: 1, backgroundColor: colors.stackScreenBackgroundColor}}>
        <NavigationContainer theme={DarkTheme}>
            
            <Stack.Navigator initialRouteName='MainScreens'>
                <Stack.Screen
                    name="MainScreens"
                    component={MainScreens}
                    options={{ headerShown: false}}    
                />
                <Stack.Screen name="Settings" component={SettingsScreen}
                    options= {{
                        headerStatusBarHeight: 0,
                        headerStyle: {
                            backgroundColor: colors.BLUE,
                        },
                        headerTitleStyle:{
                            color: 'white'
                        },
                        headerTitleAlign: 'center',
                        title: 'Settings'
                    }}
                />
                <Stack.Screen name="SettingsCategory" component={SettingsCategory}
                    options= {({route}) => ({
                        headerStatusBarHeight: 0,
                        headerStyle: {
                            backgroundColor: colors.BLUE,
                        },
                        title: getSettingsCategoryTitle(route.params.category),
                        animationEnabled: false
                    })}
                />
                <Stack.Screen name="Search Product" component={ProductSearch}
                    options= {{
                        headerStatusBarHeight: 0,
                        headerStyle: {
                            backgroundColor: colors.BLUE,
                        },
                        headerTitleStyle:{
                            color: 'white'
                        },
                        headerTitleAlign: 'center',
                        headerTintColor: 'white',
                        headerShadowVisible: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </View>
    )
}

function getSettingsCategoryTitle(category){
    switch(category){
        case 'bodyMeasurement':
            return 'Body Measurements';
        case 'target':
            return 'Activity and Target';
        case 'summary': 
            return 'Day Summary';
    }
}

const styles = StyleSheet.create({
    bottomTab: {
        backgroundColor: 'rgba(0, 105, 178, 1.00)',
        borderColor: 'black',

        fontSize: 20
    },
    icons: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        bottom: '-10%',
        

    },
    screenName: {
        fontSize: 15,
    }
})