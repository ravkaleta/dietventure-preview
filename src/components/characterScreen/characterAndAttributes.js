import { StyleSheet, Text, View, useWindowDimensions, Image} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

import Attributes from './attributes';
import SelectedDayIcon from '../common/SelectedDayIcon';
import { useCharacterStats, useUserAttributes, useUserBMI, useUserSex } from '../../providers/CommonDataProvider';

export default function CharAndAttr () {
  const { userBMI } = useUserBMI();
  const { userSex } = useUserSex();

  const { characterDamage, hpRegenRate } = useCharacterStats();
  const { userAttributes } = useUserAttributes();

  console.log('CharAndAttr render', 'sex: ', userSex, 'userBMI: ', userBMI);
  
  const { width, height } = useWindowDimensions();

  let userImage = null;

  if(userSex === 'male'){

    if(userBMI < 18.5){
      userImage = require('../../assets/images/character/male_underweight.png');
    } else if(userBMI >= 18.5 && userBMI < 25){
      userImage = require('../../assets/images/character/male_normal.png');
    } else if(userBMI >= 25 && userBMI < 30){
      userImage = require('../../assets/images/character/male_chubby.png');
    } else if(userBMI >= 30){
      userImage = require('../../assets/images/character/male_overweight.png');
    }

  } else {

    if(userBMI < 18.5){
      userImage = require('../../assets/images/character/female_underweight.png');
    } else if(userBMI >= 18.5 && userBMI < 25){
      userImage = require('../../assets/images/character/female_normal.png');
    } else if(userBMI >= 25 && userBMI < 30){
      userImage = require('../../assets/images/character/female_chubby.png');
    } else if(userBMI >= 30){
      userImage = require('../../assets/images/character/female_overweight.png');
    }

  }

  const translateX_Attributes = useSharedValue(0);
  const lastTranslateX_Attributes = useSharedValue(0);

  const translateX_Stats = useSharedValue(width * 0.02);

  const charWidth = useSharedValue(width);

  const customConfig = {
    damping: 20,
    stiffness: 200
  }

const attributePanGestureEvent = useAnimatedGestureHandler(
    {
      onStart: (event) => {
      },
      onActive: (event) => {
        const translationX = lastTranslateX_Attributes.value - event.translationX;
        const maxTranslationX = width * 0.44;
        translateX_Attributes.value = Math.min(translationX ,maxTranslationX);
        charWidth.value = width - translateX_Attributes.value;
        translateX_Stats.value = -translationX;
      },
      onEnd: (event) => {
        if(translateX_Attributes.value / width > 0.2){
          lastTranslateX_Attributes.value = width*0.44;
          charWidth.value = width*0.56;
          translateX_Stats.value = -width * 0.5;
        }
        else{
          lastTranslateX_Attributes.value = 0;
          charWidth.value = width;
          translateX_Stats.value = width * 0.02;
        }

      },
    }
  );

  const animatedCharacter = useAnimatedStyle(() => {
    return {
      width: withSpring(charWidth.value, customConfig),
    }
  })

  const animatedStats = useAnimatedStyle(() => {
    return {
      left: withSpring(translateX_Stats.value, customConfig)
    }
  })


    return (
    <Animated.View style={[styles.charAttr]}>

        <Animated.View style={[animatedStats, {position: 'absolute', height: '27%', width: '30%', backgroundColor: 'transparent', borderColor: 'white', borderLeftWidth: 1,  borderRadius: 10, alignSelf: 'center', top: '2%'}]}>

          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons name='eyedrop-outline' size={22} color={'white'} />
            </View>

            <Text style={styles.statsText}>{characterDamage[0]} - {characterDamage[1]}</Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons name='shield-outline' size={22} color='white' />
            </View>

            <Text style={styles.statsText}>{Math.floor(userAttributes.agility.value)} </Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons name='heart-circle-outline' size={22} color='white' />
            </View>

            <Text style={styles.statsText}>{60000 / hpRegenRate} HP/min</Text>
          </View>
          
          
        </Animated.View>
            
        <Animated.View style={[styles.character, animatedCharacter]}>
            <Image source={userImage} style={styles.image}/>
            <Image source={require('../../assets/images/character/shadow.png')} style={[styles.image, {zIndex: 1, transform: [{translateY: userSex === 'male' ? height * 0.01 : 0}]}]}/>
        </Animated.View>

        <PanGestureHandler onGestureEvent={attributePanGestureEvent}>
            <Animated.View style={[styles.attributesBox, {left: -width*0.07}]}> 
                <Attributes />  
            </Animated.View>
        </PanGestureHandler>


        <SelectedDayIcon/>


    </Animated.View>
    )
}

const styles = StyleSheet.create({
    backray: {
      left: '-15%',
      top: 0,
      width: '80%',
      height: '200%',
      position: 'absolute',
      zIndex: 1,
      opacity: 0.3,
    },
    frontray: {
      left: '5%',
      top: 0,
      width: '80%',
      height: '200%',
      position: 'absolute',
      opacity: 0.3,
      zIndex: 3
    },     
    charAttr: {
      height: '100%',
      width:'100%',
      flexDirection: 'row',
    },
      character: {
        height: '100%',
        justifyContent: 'center'
      },
      image: {
        position: 'absolute',
        width: '100%',
        height: '80%',
        left: '0%',
        resizeMode: 'contain',
        zIndex: 2,
        
      },
      attributesBox: {
        width: '51%',
        height: '95%',
        top: '2%',
      },
    slider: {
      height: '50%',
      width: '100%',
    },
    
    statsText: {
      flex: 2,
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center'
    }
  })