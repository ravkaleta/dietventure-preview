import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, FlatList, } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFoodData } from '../../providers/FoodDataProvider';
import { useNavigation } from '@react-navigation/native';

const MealsList = React.memo(({openModal}) => {

    console.log('MealsList render')

    const { foodData, mealsData, getDayMeals, getDayNutrients } = useFoodData();

    const { width, height } = useWindowDimensions();
    const buttonWidth = width* 0.1;
    const mealBoxHeight = height *0.07

    const navigation = useNavigation();

    const deleteProduct = (transaction_id) => {
        foodData.transaction((tx)=> {
            const query = ` DELETE FROM meals
                            WHERE transaction_id = ?`;
            tx.executeSql(query, [transaction_id], (tx,results)=> {
                console.log('Pomyślnie usunięto produkt')
                getDayMeals();
                getDayNutrients();
            },error => {
                console.error(error)
            })
        })
    }

    const limitWords = (text, limit) => {
        const words = text.split(' ');
        if(words.length > limit){
            const truncatedWords = words.slice(0,limit);
            const truncatedText = truncatedWords.join(' ');
            return truncatedText + '...';
        } else {
            const truncatedText = words.join(' ');
            return truncatedText;
        }
    }

    const MealItem = (({mealData}) => (
        <View style={[styles.mealAndProducts, {width: width * 0.94}]}>
            <View style = {[styles.mealBox,{height: mealBoxHeight}]}>
                <View style={styles.mealButtonBox}>
                    <TouchableOpacity style={styles.mealButton} onPress={() => navigation.navigate('Search Product', { mealName: mealData.name})}>
                        <Ionicons name='add-circle-outline' size={32} color='white'/>
                    </TouchableOpacity>
                </View>
                <Text style={styles.mealName}>{mealData.name}</Text>
                <View style={styles.mealInfo}>

                    {mealData.products.length > 0 ? 
                    <>
                    <View style={styles.mealCaloriesNameAndValue}>
                        <Text style={styles.mealCaloriesName}>{'Calories: '}</Text>
                        <Text style={styles.mealCaloriesValue}>{Math.round(mealData.calories)}</Text>
                    </View>
                    <View style={styles.macroBox}>
                        <View style={styles.mealMacroNameAndValue}>
                            <Text style={styles.mealMacroName}>P: </Text>
                            <Text style={styles.mealMacroValue}>{Math.round(mealData.proteins)}</Text>
                        </View>
                        <View style={styles.mealMacroNameAndValue}>
                            <Text style={styles.mealMacroName}>C: </Text>
                            <Text style={styles.mealMacroValue}>{Math.round(mealData.carbohydrates)}</Text>
                        </View>
                        <View style={styles.mealMacroNameAndValue}>
                            <Text style={styles.mealMacroName}>F: </Text>
                            <Text style={styles.mealMacroValue}>{Math.round(mealData.fat)}</Text>
                        </View>                  
                    </View>
                    </>
                    : ''}
                </View>
                <View style={styles.placeForDeleteButton}/>
            </View>
            {mealData.products ? mealData.products.map((product) =>(
                <TouchableOpacity activeOpacity={0.7} style={styles.mealProducts} key={product.transaction_id} onPress={() => openModal(product.transaction_id, product.name, product.protein, product.carbohydrates, product.total_fat, product.energy, product.amount)}>
                    <Text style={styles.mealProductName}>
                        {limitWords(product.name, 5)}
                    </Text>
                    <Text style={styles.mealProductAmount}> {Math.round(product.amount)}g</Text>
                    <View style={styles.mealProductInfo}>
                        <View style={styles.productCaloriesNameAndValue}>
                            <Text style={styles.productCaloriesName}>{'Calories: '}</Text>
                            <Text style={styles.productCaloriesValue}>{Math.round(product.energy * product.amount/100)}</Text>
                        </View>
                        <View style={styles.productMacro}>
                            <View style={styles.productMacroNameAndValue}>
                                <Text style={styles.productMacroName}>P: </Text>
                                <Text style={styles.productMacroValue}>{Math.round(product.protein * product.amount/100)}</Text>
                            </View>
                            <View style={styles.productMacroNameAndValue}>
                                <Text style={styles.productMacroName}>C: </Text>
                                <Text style={styles.productMacroValue}>{Math.round(product.carbohydrates * product.amount/100)}</Text>
                            </View>
                            <View style={styles.productMacroNameAndValue}>
                                <Text style={styles.productMacroName}>F: </Text>
                                <Text style={styles.productMacroValue}>{Math.round(product.total_fat * product.amount/100)}</Text>
                            </View>    
                        </View>   
                    </View>
                    <View style={styles.deleteButtonBox}>
                        <TouchableOpacity style={styles.deleteProductButton} onPress={() => deleteProduct(product.transaction_id)}>
                            <Ionicons name='close-outline' size={30} color='white'/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )) : ''}
        </View>
    ))


    return(
        <FlatList
                    data={mealsData}
                    decelerationRate={'fast'}
                    renderItem={({item}) => <MealItem mealData={item}/>}
                    keyExtractor={item => item.name.toString()}
                />
    )

});


const styles = StyleSheet.create({
        mealAndProducts: {
            width: '100%'
        },
            mealBox: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'rgba(0, 125, 200, 1.00)',
            borderRadius: 5,
            marginVertical: '1%'
            },
                mealButtonBox: {
                    heigth: '100%',
                    width: '15%',
                    alignItems: 'center',
                },
                    mealButton: {
                        //left: '2%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        //marginVertical: 'auto',
                    },
                mealName: {
                    height: '100%',
                    width: '42%',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: 'white',
                    textAlignVertical: 'center',
                },
                mealInfo: {
                    height: '100%',
                    width: '35%',
                    right: '2%',
                    height: '100%',
                    //backgroundColor: 'red'
                },
                    mealCaloriesNameAndValue: {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                        mealCaloriesName:{
                            flex: 3,
                            color: 'white',
                            textAlign: 'right'
                        },
                        mealCaloriesValue:{
                            flex: 2,
                            color: 'white'
                        },
                    macroBox: {
                        flex: 1,
                        flexDirection: 'row'
                    },
                        mealMacroNameAndValue: {
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        },
                            mealMacroName: {
                                flex: 1,
                                color: 'white',
                            },
                            mealMacroValue:{
                                flex: 2,
                                color: 'white',
                            },
                placeForDeleteButton:{
                    height: '100%',
                    width: '8%'
                },
            mealProducts: {
                width: '100%',
                //backgroundColor: 'black',
                flexDirection: 'row',
                //borderBottomWidth: 1,
                marginVertical: '1%'
            },
                mealProductName: {
                    height: '100%',
                    width: '45%',
                    fontSize: 18,
                    left: '0%',
                    borderLeftWidth: 1,
                    borderColor: 'gray',
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'center'
                },
                mealProductAmount: {
                    height: '100%',
                    width: '12%',
                    //textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'white',
                },
                mealProductInfo: {
                    height: '100%',
                    width:  '35%',
                    //backgroundColor: 'red'
                },
                    productCaloriesNameAndValue: {
                        color: 'white',
                        flex: 1,
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                        productCaloriesName: {
                            flex: 3,
                            color: 'gray',
                            fontSize: 11,
                            textAlign: 'right'
                        },
                        productCaloriesValue:{
                            flex: 2,
                            color: 'white',
                            fontSize: 13
                        },
                    productMacro: {
                        flex: 1,
                        flexDirection: 'row',
                    },
                        productMacroNameAndValue:{
                            flex: 1,
                            flexDirection: 'row'
                        },
                            productMacroName: {
                                flex: 1,
                                fontSize: 11,
                                color: 'transparent'
                            },
                            productMacroValue: {
                                flex: 2,
                                color: 'white',
                                fontSize: 13
                            },
                deleteButtonBox: {
                    height: '100%',
                    width: '8%',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center'
                },
                    deleteProductButton: {

                    },
})

export default MealsList;