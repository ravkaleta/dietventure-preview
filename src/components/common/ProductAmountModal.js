import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFoodData } from '../../providers/FoodDataProvider';
import { colors } from '../../styles/global';

const ProductAmountModal = React.memo(({
    selectedItemId,
    selectedItemName,
    selectedItemProtein,
    selectedItemCarbohydrates,
    selectedItemFat,
    selectedItemEnergy,
    amount,
    modalVisible,
    setModalVisible,
    selectedDay = '',
    mealName = '',
    inputType
})  => {

    console.log('ProductAmountModal render', amount, inputType)
    console.log('selectedDay ', selectedDay, 'mealName ', mealName)

    const { foodData, getDayMeals, getDayNutrients} = useFoodData();
    const [productAmount, setProductAmount] = useState(100);

    useEffect(() => {
        setProductAmount(amount);
    },[amount])

    const addFoodProduct = () => {
        foodData.transaction((tx) => {
            const dateString = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
            const query = `
                INSERT INTO meals (date, product_id, meal, amount) VALUES (?, ?, ?, ?)
            `
            const params = [dateString, selectedItemId, mealName, productAmount ? productAmount : 100];
            tx.executeSql(query, params, (tx,results)=> {
                console.log('Pomyślnie dodano produkt')
            },error => {
                console.error(error)
            })
        })
        setModalVisible(false);
        getDayMeals();
        getDayNutrients();
    }

    const updateProductAmount = () => {
        foodData.transaction((tx)=> {
            const query = ` UPDATE meals
                            SET amount = ?
                            WHERE transaction_id = ?`;
            tx.executeSql(query, [productAmount, selectedItemId], (tx,results)=> {
                console.log('Pomyślnie zmieniono wagę produkt')
                getDayMeals();
                getDayNutrients();
            },error => {
                console.error(error)
            })
        })
        setModalVisible(false);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const handleAmountInputChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        setProductAmount(numericValue);
    };

    return (
        <Modal visible={modalVisible} transparent={true} animationType="none">
                <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa'}} onPress={closeModal}>
                    <View style={styles.updateAmountBox}>
                            <View style={[styles.modalProductNameBox, {backgroundColor: colors.BLUE}]}>
                                <Text style={[styles.modalProductName]}> {selectedItemName} </Text>
                            </View>
                            <View style={styles.modalProductInfoBox}>
                                <Text style={styles.modalProductCalories}> Calories: <Text style={styles.modalMacroValue}>{productAmount > 0 ? Math.round(selectedItemEnergy * (productAmount/100)): selectedItemEnergy}</Text> </Text> 
                                <View style={styles.modalMacroBox}>
                                    <Text style={styles.modalMacroText}> P: <Text style={styles.modalMacroValue}>{productAmount > 0 ? Math.round(selectedItemProtein * (productAmount/100)) : Math.round(selectedItemProtein)}</Text> </Text> 
                                    <Text style={styles.modalMacroText}> C: <Text style={styles.modalMacroValue}>{productAmount > 0 ? Math.round(selectedItemCarbohydrates * (productAmount/100)): Math.round(selectedItemCarbohydrates)}</Text> </Text> 
                                    <Text style={styles.modalMacroText}> F: <Text style={styles.modalMacroValue}>{productAmount > 0 ? Math.round(selectedItemFat * (productAmount/100)): Math.round(selectedItemFat)}</Text> </Text> 
                                </View>
                            </View>
                        <View style={styles.modalInputBox}>
                            
                            <TextInput
                                style={styles.modalInput}
                                value={productAmount.toString()}
                                placeholder={amount.toString()}
                                keyboardType='numeric'
                                onChangeText={handleAmountInputChange}
                                maxLength={4}
                            />
                            <Text style={styles.modalInputText}> g </Text>
                        </View>
                        <View style={styles.modalButtonsBox}>
                            <TouchableOpacity style={styles.modalButton} title="Update Amount" onPress={inputType === 'updateProduct' ? updateProductAmount : addFoodProduct}>
                                <Ionicons name='checkmark-circle' size={40} color={colors.GRAY}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} title="Close" onPress={closeModal}>
                                <Ionicons name='close-circle' size={40} color={colors.GRAY}/>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </Pressable>
            </Modal>
    )
});

const styles = StyleSheet.create({
    updateAmountBox: {
        width: '70%',
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center'
    },
        modalProductNameBox: {

            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: '8%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20

        },
            modalProductName: {
                textAlign:'center',
                fontSize: 20,
                width: '90%',
                fontWeight: 'bold',
                color: 'white'
            },
        modalProductInfoBox: {
            paddingTop: '8%',
            justifyContent: 'center'
        },
            modalProductCalories: {
                textAlign: 'center',
                fontSize: 17
            },
            modalMacroBox: {
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: '3%'
            },
                modalMacroValue:{
                    fontWeight:'bold'
                },
                modalMacroText: {
                    fontSize: 17
                },
        modalInputBox: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'
        },
            modalInputText: {
                textAlignVertical:'center',
                fontSize: 12,
                color: 'gray',
                
            },
            modalInput:{ 
                textAlign: 'center',
                width: '40%',
                height: 40,
                borderColor: 'gray',
                padding: 0,
                borderBottomWidth: 1,
                marginBottom: 10,
                
            },
        modalButtonsBox: {
            paddingVertical: '8%',
            width: '55%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
            modalButton: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }
    
})

export default ProductAmountModal;