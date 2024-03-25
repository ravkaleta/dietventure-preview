import {View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors } from '../../styles/global';

export default function ActivityBar({userPhysicalActivity, setTempActivity, width=1}) {

    const screenWidth = useWindowDimensions().width;
    const activityBarWidth = screenWidth * 0.8 * width;
    const activityBarSpaceBetween = (screenWidth - activityBarWidth)/2;

    const adjustedUserPhysicalActivity = userPhysicalActivity * 25;

    const activityIndicator_Alignment = useSharedValue(adjustedUserPhysicalActivity); 

    const activityGestureEvent = useAnimatedGestureHandler({
        onStart: (event) => {
            const translationX = (event.absoluteX - activityBarSpaceBetween)/activityBarWidth * 100;
            activityIndicator_Alignment.value = Math.min(Math.max(0, Math.round(translationX / 25) * 25), 100);

            const adjustedIndicatorValue = activityIndicator_Alignment.value/25;
            runOnJS(setTempActivity)(adjustedIndicatorValue);

        },
        onActive: (event) => {
            const translationX = (event.absoluteX - activityBarSpaceBetween)/activityBarWidth * 100;
            activityIndicator_Alignment.value = Math.min(Math.max(0, Math.round(translationX / 25) * 25), 100);
        },
        onEnd: (event) => {

            const adjustedIndicatorValue = activityIndicator_Alignment.value/25;
            runOnJS(setTempActivity)(adjustedIndicatorValue);

        }
    });

    const animatedActivityIndicator = useAnimatedStyle(() => {

        const percentageValue = activityIndicator_Alignment.value + '%'
        return {
            left: percentageValue
        }
    });

    return(
        <PanGestureHandler onGestureEvent={activityGestureEvent}>
                    <Animated.View style={{alignItems: 'center', paddingVertical: '8%'}}>
                        
                        
                        <View style={[styles.targetBar, {width: activityBarWidth}]}>  
                            <View style={[styles.snapBreakpointBox,{left: 0}]}>
                                <Text style={styles.snapBreakpointText}>little</Text>
                            </View>  
                            <View style={[styles.snapBreakpointTrainingBox,{left: '25%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>light</Text>
                            </View>   
                            <View style={[styles.snapBreakpointTrainingBox,{left: '50%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>moderate</Text>
                            </View>   
                            <View style={[styles.snapBreakpointTrainingBox,{left: '75%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>hard</Text>
                            </View>    
                            <View style={[styles.snapBreakpointTrainingBox,{left: '100%'}]}>
                                <Text style={styles.snapBreakpointText}>very hard</Text>
                            </View>                 
                            <Animated.View style={[styles.targetBarIndicator, animatedActivityIndicator]}/>                     
                                                                                    
                        </View>
                        
                    </Animated.View>
                </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    targetBar: {
        height: 10,
        backgroundColor: colors.BLUE,
        borderRadius: 10,

    },
    targetBarIndicator: {
        position: 'absolute',
        height: 20,
        width: 12,
        backgroundColor: 'white',
        transform: [{translateY: -5}, {translateX: -6}],
        borderRadius: 10
    },
    snapBreakpointBox: {
        width: 40,
        height: 16,
        backgroundColor: 'transparent',
        transform: [{translateY: -3}, {translateX: -20}],
        position: 'absolute',
        alignItems: 'center'
    },
    snapBreakpoint: {
        position: 'absolute',
        backgroundColor: colors.BLUE,
        height: 16,
        width: 2,
    },
    snapBreakpointText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        transform: [{translateY: -25}]
    },

    snapBreakpointTrainingBox: {
        width: 60,
        height: 16,
        backgroundColor: 'transparent',
        transform: [{translateY: -3}, {translateX: -30}],
        position: 'absolute',
        alignItems: 'center'
    },
})