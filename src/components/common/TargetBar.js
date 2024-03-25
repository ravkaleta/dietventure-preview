import {View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { colors } from '../../styles/global';

export default function TargetBar ({userWeightTarget, setTempWeightTarget, width=1}) {

    const screenWidth = useWindowDimensions().width;
    const targetBarWidth = screenWidth * 0.8 * width;
    const targetBarSpaceBetween = (screenWidth - targetBarWidth)/2;

    const adjustedUserWeightTarget = 50 + userWeightTarget * 100 / 2;

    const targetIndicator_Alignment = useSharedValue(adjustedUserWeightTarget); 

    const targetGestureEvent = useAnimatedGestureHandler({
        onStart: (event) => {
            const translationX = (event.absoluteX - targetBarSpaceBetween)/targetBarWidth * 100;
            targetIndicator_Alignment.value = Math.min(Math.max(0, Math.round(translationX / 10) * 10), 100);
            const adjustedIndicatorValue = targetIndicator_Alignment.value/100 * 2
            const tempTarget = -1 + adjustedIndicatorValue;
            const fixedTempTarget = tempTarget.toFixed(1);
            runOnJS(setTempWeightTarget)(fixedTempTarget);

        },
        onActive: (event) => {
            const translationX = (event.absoluteX - targetBarSpaceBetween)/targetBarWidth * 100;
            targetIndicator_Alignment.value = Math.min(Math.max(0, Math.round(translationX / 10) * 10), 100);
        },
        onEnd: (event) => {
            const adjustedIndicatorValue = targetIndicator_Alignment.value/100 * 2
            const tempTarget = -1 + adjustedIndicatorValue;
            const fixedTempTarget = tempTarget.toFixed(1)
            runOnJS(setTempWeightTarget)(fixedTempTarget);
        }
    });

    const animatedTargetIndicator = useAnimatedStyle(() => {

        const percentageValue = targetIndicator_Alignment.value + '%'
        return {
            left: percentageValue
        }
    })

    return(
        <PanGestureHandler onGestureEvent={targetGestureEvent}>
                    <Animated.View style={{alignItems: 'center', paddingVertical: '6%'}}>
                        
                        <View style={[styles.targetBar, {width: targetBarWidth}]}>  
                            <View style={[styles.snapBreakpointBox,{left: 0}]}>
                                <Text style={styles.snapBreakpointText}>-1</Text>
                            </View>  
                            <View style={[styles.snapBreakpointBox,{left: '10%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>-0.8</Text>
                            </View>
                            <View style={[styles.snapBreakpointBox,{left: '20%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>-0.6</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '30%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>-0.4</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '40%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>-0.2</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '50%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>0</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '60%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>0.2</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '70%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>0.4</Text>
                            </View>   
                            <View style={[styles.snapBreakpointBox,{left: '80%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>0.6</Text>
                            </View>        
                            <View style={[styles.snapBreakpointBox,{left: '90%'}]}>
                                <View style={styles.snapBreakpoint}/>
                                <Text style={styles.snapBreakpointText}>0.8</Text>
                            </View>  
                            <View style={[styles.snapBreakpointBox,{left: '100%'}]}>
                                <Text style={styles.snapBreakpointText}>1</Text>
                            </View>                 
                            <Animated.View style={[styles.targetBarIndicator, animatedTargetIndicator]}/>                     
                                                                                    
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