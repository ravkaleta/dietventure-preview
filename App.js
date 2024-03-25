import React ,{useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {StatusBar, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Updates from 'expo-updates';

import { UserDataProvider } from './src/providers/UserDataProvider';
import MainContainer from './src/navigation/MainContainer';
import { FoodDataProvider } from './src/providers/FoodDataProvider';
import { GameDataProvider } from './src/providers/GameDataProvider';
import { GameLogicProvider } from './src/providers/GameLogicProvider';
import { CommonDataProvider } from './src/providers/CommonDataProvider';


export default function App() {

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('Aplikacja była w tle i teraz jest znowu aktywna');
        Updates.reloadAsync();
      }
      setAppState(nextAppState);
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
        subscription.remove();
    }
}, [appState]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(43, 43, 43, 1.00)'}}>
    <CommonDataProvider>
      <UserDataProvider>
        <FoodDataProvider>
          <GameDataProvider>
            <GameLogicProvider>
              <StatusBar translucent backgroundColor='transparent' barStyle="light-content"/>
              
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <MainContainer/>
                </GestureHandlerRootView>
            </GameLogicProvider>
          </GameDataProvider>
        </FoodDataProvider>
      </UserDataProvider>
    </CommonDataProvider>
    </SafeAreaView>
  );
}
