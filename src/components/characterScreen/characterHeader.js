import React, { } from 'react';
import { StyleSheet, View , Image, useWindowDimensions, TouchableOpacity} from 'react-native';

import { dimensions } from '../../styles/global';
import { useNavigation } from '@react-navigation/native';

import Gold from './header/gold';
import HealthBar from './header/healthBar';
import EnergyBar from './header/energyBar';


export default function CharacterHeader() {
    console.log('CharacterHeader render');

    const navigation = useNavigation();

    const windowHeight = useWindowDimensions().height;
    
    return (
        <View style={[styles.header, {height: windowHeight * dimensions.headerHeight} ]}>
            <View style={{flex: 1}}>
                <Gold/>
            </View>
            <View style={styles.characterInfo}>
                
                <HealthBar/>
                <EnergyBar/>
    
            </View>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBox}>
                    <Image source={require('../../assets/images/settingsIcon.png')} style={styles.settingsIcon}/>
                </TouchableOpacity>
        </View>
    )
    }

const styles = StyleSheet.create({
    header: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'rgba(217, 240, 255, 1.00)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'transparent',
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    eqIcon: {
        width: '90%',
        height: '90%',
        marginVertical: '2%',
        resizeMode: 'contain',
        //backgroundColor: 'red'
    },
    characterInfo: {
        flex: 3,
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