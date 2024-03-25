import React, { useState, useRef} from 'react';
import { StyleSheet, Text, View , Pressable, FlatList, Dimensions, TouchableOpacity, Image} from 'react-native';
import { useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { dimensions } from '../../styles/global';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { months, days } from '../../constants/calendar';
import { isSelected, isCurrent, getCurrentDayInfo } from '../../utils/dateUtils';
import { useCurrentDayInfo, useSelectedDay } from '../../providers/CommonDataProvider';


const getWeek = (weekOffset) => {
    const startOfWeek = new Date();
    var day = startOfWeek.getDay();
    if (day === 0) day = 7;
    startOfWeek.setDate(startOfWeek.getDate() - day + 1  + weekOffset);
    const weekDate = new Date(startOfWeek);
    const week = {id: startOfWeek.getDate().toString() + startOfWeek.getMonth().toString() + startOfWeek.getYear().toString(), weekDays: []};
    for(let i = 1; i <= 7; i++) {
        const dayInfo = {
            day: weekDate.getDate(),
            month: weekDate.getMonth() + 1,
            year: weekDate.getFullYear(),
        }
        week.weekDays.push(dayInfo);
        weekDate.setDate(weekDate.getDate() + 1);
    }

    return week;
  };


  const getDay = (i) => {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i)
    return futureDate.getDate();
  }

  const getMonth = (i) => {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() - futureDate.getDay() + i + 1)
    return months[futureDate.getMonth()];
  }

  const getYear = (i) => {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() - futureDate.getDay() + i + 1)
    return futureDate.getFullYear();
  }

  

export default function Header() {
    console.log('mealsHeader render');

    const navigation = useNavigation();

    const windowHeight = useWindowDimensions().height;
    const [weekOffset, setWeekOffset] = useState(0);

    const { selectedDay, setSelectedDay } = useSelectedDay();

    const { currentDayInfo } = useCurrentDayInfo();

    const weekWidth = Dimensions.get('window').width;

    const flatListRef = useRef(null);

    const allWeeks = [getWeek(weekOffset - 7), getWeek(weekOffset), getWeek(weekOffset + 7)];
    const [weeks, setWeeks] = useState(allWeeks);

    const [flatListRefreshing, setFlatListRefreshing] = useState(false);

    const StandardDay = ({dayInfo, index}) => (
        <View style={[styles.day, {width: weekWidth / 10, aspectRatio: 1, borderRadius: weekWidth / 10 / 2, marginHorizontal: 6,
                        backgroundColor: 'rgba(43, 43, 43, 1.00)'} ]} >
            <TouchableOpacity activeOpacity={0.7} onPress={() => {setSelectedDay(dayInfo)}} >
                <Text style = {styles.dayOfTheWeekText}>
                    {days[index]}
                </Text>    
                <Text style={[styles.dayText, {color: isCurrent(dayInfo, currentDayInfo) ? '#FF7676' : selectedDay === dayInfo ? 'black' : 'white'}]}>
                    {dayInfo.day}
                </Text>
            </TouchableOpacity>
        </View>
    )

    const SelectedDay = ({dayInfo, index}) => (
        <LinearGradient
        colors={['white', 'rgba(43, 43, 43, 1.00)']}
        start={{ x: 0, y: 3 }}
        end={{ x: 0, y: 0 }}
        style={[styles.day, {width: weekWidth / 10, aspectRatio: 1, borderRadius: weekWidth / 10 / 2, marginHorizontal: 6}]}
        >
        
            <Pressable onPress={() => {setSelectedDay(dayInfo)}} >
                <Text style = {styles.dayOfTheWeekText}>
                    {days[index]}
                </Text>    
                <Text style={[styles.dayText, {color: isCurrent(dayInfo, currentDayInfo) ? '#FF7676' : 'white'}]}>
                    {dayInfo.day}
                </Text>
            </Pressable>

        </LinearGradient>
    )

    const WeekItem = React.memo(({weekData}) => (
        <View style={[styles.daysOfTheWeek,{width: weekWidth, justifyContent: 'center', alignItems: 'center'}]}>
            <View style={{width: weekWidth, height: '8%', position: 'absolute', backgroundColor: 'rgba(0, 105, 178, 1.00)'}}/>
            {weekData.weekDays.map((dayInfo, index) => (
                isSelected(dayInfo, selectedDay) ?
                    <SelectedDay dayInfo={dayInfo} index={index} key={index}/> 
                    :
                    <StandardDay dayInfo={dayInfo} index={index} key={index}/>
            ))}
        </View>
    ));

    const handleLayout = () => {
        flatListRef.current.scrollToIndex({animated: false, index: 1});
    }

    const createNewWeeks = (event) => {
        const offSetX = event.nativeEvent.contentOffset.x;
        const layoutWidth = event.nativeEvent.layoutMeasurement.width;
        const visibleIndex = Math.floor(offSetX / layoutWidth);
    } 

    const handleScroll = (event) => {
        const distanceFromStart  = event.nativeEvent.contentOffset.x;
        if(distanceFromStart === 0){
            const newWeekOffset = weekOffset - 7;
            setWeekOffset(newWeekOffset);
            const newWeek = getWeek(newWeekOffset - 7);
            var newWeeks = [newWeek, ...weeks.slice(0,2)];
            setWeeks(prevWeeks => [newWeek, ...prevWeeks.slice(0,2)]);
            flatListRef.current.scrollToIndex({animated: false, index: 1});
        }
    }

    const handleEndReached = () => {
        const newWeekOffset = weekOffset + 7;
        setWeekOffset(newWeekOffset);
        const newWeek = getWeek(newWeekOffset + 7);
        var newWeeks = [ ...weeks.slice(1), newWeek];
        //setWeeks(newWeeks)
        setWeeks(prevWeeks => [...prevWeeks.slice(1), newWeek]);
        flatListRef.current.scrollToIndex({animated: false, index: 1});
    }

    const resetWeekSlider = () => {
        const newWeekOffset= 0;
        setWeekOffset(newWeekOffset);
        const newWeeks = [getWeek(newWeekOffset - 7), getWeek(newWeekOffset), getWeek(newWeekOffset + 7)];
        setWeeks(newWeeks);
        setSelectedDay(currentDayInfo);
        //flatListRef.current.scrollToIndex({animated: false, index: 1});
    }



    return (
        
        <View style={[styles.header, {height: windowHeight * dimensions.headerHeight}]}>
            <View style={styles.week}>
                <TouchableOpacity style={{justifyContent: 'center', position: 'absolute', right: '90%', display: weekOffset != 0 ? 'flex' : 'none'}}
                    onPress={() => resetWeekSlider()}
                >
                    <Ionicons name='today' size={22} color='white'/>
                </TouchableOpacity>
                <Text style={styles.monthText}>{getMonth(weekOffset)}{' '}{getYear(weekOffset)}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={weeks}
                refreshing = {flatListRefreshing}
                onLayout={handleLayout}
                //onMomentumScrollBegin={handleBeginScroll}
                //onMomentumScrollEnd={handleWeekChange}
                onScrollEndDrag={createNewWeeks}
                onScroll={handleScroll}
                onEndReached={handleEndReached}
                decelerationRate={'fast'}
                renderItem={({item}) => <WeekItem weekData={item} />}
                keyExtractor={item => item.id}
                horizontal={true}
                pagingEnabled={true}  
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => (
                    {length: weekWidth, offset: weekWidth * index, index}
                )}
                />

            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBox}>
                <Image source={require('../../assets/images/settingsIcon.png')} style={styles.settingsIcon}/>
            </TouchableOpacity>

        </View>
    )
    }

const styles = StyleSheet.create({
    header: {
        //backgroundColor: 'black',
        zIndex: 4,
        alignItems: 'center'
    },
    week: {
        //backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '25%',
        marginTop: '2%',
        borderRadius: 5,
        width: '50%'

    },
    monthText: {
        //flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',   
        fontSize: 18,
        textAlignVertical: 'center',
    },
    arrow: {
        backgroundColor: '#f2f2f2',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingRight: 2,
        paddingLeft: 2,
        borderRadius: 5,
        fontSize: 30,
        textAlignVertical: 'center',

    },
    weeksBox: {
        
        flexDirection: 'row'
    },
    daysOfTheWeek: {
        flexDirection: 'row',
        top: '4%',
    },
    day:{
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 10,
        borderWidth: 2,
        borderColor: 'rgba(0, 105, 178, 1.00)'
        
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
    settingsBox: {
        position: 'absolute',
        width: '15%',
        height: '40%',
        top: 0,
        right: 0,
        //backgroundColor: 'red'
    },
    settingsIcon: {
        top: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    }
})