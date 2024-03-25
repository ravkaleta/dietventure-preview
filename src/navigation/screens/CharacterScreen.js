
import React from 'react';
import { View } from 'react-native';


import CharacterOrMeals from '../../components/common/CharacterOrMeals';
import CharacterHeader from '../../components/characterScreen/characterHeader';

import {colors} from '../../styles/global';


export default function CharacterScreen() {
  console.log('CharacterScreen render')
  const selectedScreen = 'Character';


  return (
    <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>

      <CharacterHeader/>
      <CharacterOrMeals selectedScreen= {selectedScreen}/>

          
          
    </View>
  );
}


