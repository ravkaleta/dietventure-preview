import { StyleSheet, View } from 'react-native';
import React, { useState, useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useFoodData } from '../../providers/FoodDataProvider';
import ProductAmountModal from '../common/ProductAmountModal';
import MealsList from './MealsList';

export default function Meals () {
    console.log('Meals render');
    
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemAmount, setSelectedItemAmount] = useState(100);

    const [selectedItemTransactionId, setSelectedItemTransactionId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [selectedItemProtein, setSelectedItemProtein] = useState(null);
    const [selectedItemCarbohydrates, setSelectedItemCarbohydrates] = useState(null);
    const [selectedItemFat, setSelectedItemFat] = useState(null);
    const [selectedItemEnergy, setSelectedItemEnergy] = useState(null);
            
    const { foodData, mealsData, getDayMeals, getDayNutrients } = useFoodData();

    

    const openModal = useCallback((transaction_id, name, protein, carbohydrates, fat, energy, amount) => {
        setSelectedItemTransactionId(transaction_id)
        setSelectedItemName(name);
        setSelectedItemProtein(protein);
        setSelectedItemCarbohydrates(carbohydrates);
        setSelectedItemFat(fat);
        setSelectedItemEnergy(energy);
        setSelectedItemAmount(amount);
        setModalVisible(true);
    }, []);


    return (
        <View style={styles.container}>
            <View style={{height: '98%'}}>
                <MealsList openModal={openModal}/>
            </View>
            <ProductAmountModal
                selectedItemId={selectedItemTransactionId}
                selectedItemName={selectedItemName}
                selectedItemProtein={selectedItemProtein}
                selectedItemCarbohydrates={selectedItemCarbohydrates}
                selectedItemFat={selectedItemFat}
                selectedItemEnergy={selectedItemEnergy}
                amount={selectedItemAmount}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                inputType={'updateProduct'}
            />       
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '97%',
        height: '95%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})