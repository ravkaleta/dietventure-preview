import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import { useCurrentDayInfo, useSelectedDay } from "../../providers/CommonDataProvider";
import { isCurrent } from "../../utils/dateUtils";
import { months } from "../../constants/calendar";
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from "react-native-gesture-handler";

const SelectedDayIcon = () => {
    console.log('SelectedDayIcon render')

    const { selectedDay, setSelectedDay } = useSelectedDay();
    const { currentDayInfo } = useCurrentDayInfo();

    const isDayCurrent = isCurrent(selectedDay, currentDayInfo);


    return (
        <View style={{display: !isDayCurrent ? 'flex' : 'none', width: '20%', alignItems: 'center', bottom: '-3%', position: 'absolute'}}>
            <LinearGradient
            colors={['white', 'rgba(43, 43, 43, 1.00)']}
            start={{ x: 0, y: 3 }}
            end={{ x: 0, y: 0 }}
            style={[styles.day, {width: 50, aspectRatio: 1, borderRadius: 50/2}]}
            >
            
                <TouchableOpacity onPress={() => {setSelectedDay(currentDayInfo)}} >
                    <Text style={[styles.dayText, {color: isDayCurrent ? '#FF7676' : 'white'}]}>
                        {selectedDay.day}
                    </Text>
                    <Text style={{textAlign: 'center', color: 'white', width: '90%', fontSize: 13}}>
                        {months[selectedDay.month - 1].substring(0,4)}
                    </Text>
                </TouchableOpacity>

            </LinearGradient>
            <Ionicons name='arrow-down-outline' size={22} color='white'/>
        </View>
    )
}

const styles = StyleSheet.create({
    day:{
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 10,
        borderWidth: 2,
        borderColor: 'rgba(0, 105, 178, 1.00)',
        alignItems: 'center'
        
    },
    dayOfTheWeekText: {
        textAlign: 'center',
        fontSize: 10,
        color: 'white'
    },
    dayText:{
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
})

export default SelectedDayIcon;