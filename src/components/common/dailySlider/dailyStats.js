import { StyleSheet, View } from 'react-native';
import { colors, dimensions } from '../../../styles/global';
import Ionicons from '@expo/vector-icons/Ionicons';

import Trainings from './trainings';
import MacroBar from './macroBar';




export default function DailyStats({selectedScreen}) {
  console.log('DailyStats render');

  const visiblePartHeight = dimensions.sliderHeight;

return (
      <View style={[styles.stats]}>

        <View style={{height: visiblePartHeight * 0.3, width: '100%', alignItems: 'center'}}>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', width: '50%', borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
            <Ionicons name='caret-up-outline' size={22} color= {colors.YELLOW_WHITE} />
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: colors.YELLOW_WHITE}}>

          <MacroBar/>
          <Trainings/>

        </View>
      </View>
        
)
}

const styles = StyleSheet.create({
  stats: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
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