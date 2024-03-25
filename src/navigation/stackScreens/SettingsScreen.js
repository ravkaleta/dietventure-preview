import {View, Text, StyleSheet, Image, StatusBar, Dimensions, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/global';
import { useUserData } from '../../providers/UserDataProvider';


export default function SettingsScreen(){

    const navigation = useNavigation();

    const { userAge, userWeight, userHeight } = useUserData();

    const categories = [
        {
            name: 'Day Summary',
            route: 'summary'
        },
        {
            name: 'Body Measurements',
            route: 'bodyMeasurement'
        },
        {
            name: 'Activity and Target',
            route: 'target'
    },
    ];
    
    return(
        <View style={{flex: 1, backgroundColor: colors.stackScreenBackgroundColor}}>
            <StatusBar backgroundColor= {colors.BLUE} barStyle="light-content"/>
            {categories.map((category) => (
                <TouchableOpacity style={styles.option} key={category.route} onPress={() => navigation.navigate('SettingsCategory', { category: category.route })}>
                    <Text style={{left: '2%', color: 'white', fontWeight: 'normal', fontSize: 20}}> {category.name} </Text>
                </TouchableOpacity>
            ))}
            {userAge == 123 && userHeight == 123 && userWeight == 123 && 
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SettingsCategory', { category: 'developer' })}>
                    <Text style={{left: '2%', color: 'white', fontWeight: 'normal', fontSize: 20}}> Developer </Text>
                </TouchableOpacity>    
            }
        </View>
    )
}

const styles = StyleSheet.create({
    option: {
        height: '8%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'white',
        borderBottomWidth: 0,
        marginBottom: '1%',
        borderRadius: 10,
        justifyContent: 'center'
    }
})