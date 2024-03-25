
import { StyleSheet, View, useWindowDimensions} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';

import DailyStats from './dailySlider/dailyStats';
import CharAndAttr from '../characterScreen/characterAndAttributes';
import Meals from '../mealsScreen/meals';
import { useSliderAnimation } from '../../providers/CommonDataProvider';

export default function CharacterOrMeals({selectedScreen}) {
  console.log('CharacterOrMeals render', selectedScreen)

  const { charAttrHeight, lastTranslateY_Stats, screensHeight} = useSliderAnimation();
  
  const sHeight = useWindowDimensions().height;
  
  const translateY_Stats = useSharedValue(0);

  const customConfig = {
    damping: 20,
    stiffness: 200
  }

  const statsPanGestureEvent = useAnimatedGestureHandler({
    onStart: (event) => {
    },
    onActive: (event) => {
      const translationY = lastTranslateY_Stats.value - event.translationY
      const maxTranslationY = screensHeight ;
      translateY_Stats.value = Math.min(translationY , maxTranslationY * 0.3);
      charAttrHeight.value = Math.min(screensHeight, screensHeight - translateY_Stats.value);
    },
    onEnd: (event) => {
      if(translateY_Stats.value / screensHeight > 0.2){
        lastTranslateY_Stats.value = screensHeight*0.25;
        charAttrHeight.value = screensHeight*0.75;
      }
      else{
        lastTranslateY_Stats.value = 0;
        charAttrHeight.value = screensHeight;
      }
    }
  });

  const animatedScreens = useAnimatedStyle(() => {

    const percentageValue = charAttrHeight.value + '%';

    return{ 
      height: withSpring(charAttrHeight.value, customConfig)
    }
  })

  return (
    <View style={{ flex: 1 }}>
          <Animated.View style={[styles.screensView, animatedScreens, {height: screensHeight}]}>
              {selectedScreen === 'Character' ? <CharAndAttr/> : <Meals/>}
          </Animated.View>
          <PanGestureHandler onGestureEvent={statsPanGestureEvent}>
              <Animated.View style={[styles.slider, {height: sHeight * 0.4}]}>
                  <DailyStats selectedScreen={selectedScreen}/>
              </Animated.View>
          </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  meals: {
    backgroundColor: 'white',
    width: '97%',
    borderRadius: 10,
    marginRight: '1.5%'
  },
  screensView: {
      width: '100%',
      justifyContent: 'center',
      alignItems:'center'
  },
  charAttr: {
    height: '100%',
    width:'100%',
    flexDirection: 'row',
  },
    character: {
      height: '100%',
    },
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: '-5%',
      resizeMode: 'contain',
      zIndex: 2
    },
    attributesBox: {
      width: '50%',
      height: '95%',
      top: '2%',   
    },
  slider: {
    width: '100%',
  },
  
  
})