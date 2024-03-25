import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { openFoodDatabase } from '../utils/databaseUtils';
import meals from '../constants/mealsDataStructure';
import { useCurrentDayCalories, useCurrentDayInfo, useFoodLoadedData, useGameLoadedData, useSelectedDay, useSelectedDayNutrients } from './CommonDataProvider';

const FoodDataContext = createContext();

export function useFoodData() {
    return useContext(FoodDataContext);
}

export function FoodDataProvider({children}) {
    console.log('FoodData load');

    //const { userDataLoaded } = useUserLoadedData();
    const { gameDataLoaded } = useGameLoadedData();

    const { foodDataLoaded, setFoodDataLoaded } = useFoodLoadedData();

    const { setSelectedDayNutrients } = useSelectedDayNutrients();

    const { setTodayCalories } = useCurrentDayCalories();


    const { currentDayInfo } = useCurrentDayInfo();
    const { selectedDay } = useSelectedDay();


    const [foodData, setFoodData] = useState(null);
    const [mealsData, setMealsData] = useState(meals);
    //const [foodDataLoaded, setFoodDataLoaded] = useState(false);

    



    useEffect(() => {
        const fetchDb = async () => {
            const foodDb = await openFoodDatabase();
            setFoodData(foodDb);
        }
        
        fetchDb();
    }, []);

    const getDayMeals = async () => {
        try {
            console.log('Pobieranie danych o posiłkach.');

            const dateString = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
            foodData.transaction(tx => {
                const query = ` SELECT meals.transaction_id, meals.meal, meals.product_id, meals.amount, foodData.name,
                                foodData.energy, foodData.protein,
                                foodData.carbohydrates, foodData.total_fat
                                FROM meals
                                JOIN foodData ON meals.product_id = foodData.id
                                WHERE meals.date = ?`;
                tx.executeSql(query, [dateString], (tx, results) =>{
                    const rows = results.rows;
                    const updatedMeals = [...meals];
                    
                    for (let i = 0; i < rows.length; i++) {
                        const product = rows.item(i);
                        const mealIndex = updatedMeals.findIndex((meal) => meal.name === product.meal);

                        if (mealIndex !== -1) {
                            updatedMeals[mealIndex] = {
                                ...updatedMeals[mealIndex],
                                products: [...updatedMeals[mealIndex].products, product],
                            };
                        }
                    }

                    for(let i = 0; i < meals.length; i++){
                        updatedMeals[i] = {
                            ...updatedMeals[i],
                            calories: updatedMeals[i].products.reduce((total, product) => total + (product.energy * product.amount / 100), 0),
                            proteins: updatedMeals[i].products.reduce((total, product) => total + (product.protein * product.amount / 100), 0),
                            carbohydrates: updatedMeals[i].products.reduce((total, product) => total + (product.carbohydrates * product.amount / 100), 0),
                            fat: updatedMeals[i].products.reduce((total, product) => total + (product.total_fat * product.amount / 100), 0),
                        };
                    }

                    setMealsData(updatedMeals);
                },(tx,error) =>{
                    console.error(error);
                });
            })
        } catch (error) {
            console.log(error);          
        }
    }

    const getDayNutrients = async () => {
        try {
            console.log('Pobieranie danych o wartościach odżywczych.');

            const dateString = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
            foodData.transaction(async tx => {
                const query = ` SELECT 
                                    IFNULL(ROUND(SUM(foodData.protein * meals.amount/100), 2), 0) AS totalProteins,
                                    IFNULL(ROUND(SUM(foodData.total_fat * meals.amount/100), 2), 0) AS totalFat,
                                    IFNULL(ROUND(SUM(foodData.carbohydrates * meals.amount/100), 2), 0) AS totalCarbohydrates,
                                    IFNULL(ROUND(SUM(foodData.energy * meals.amount/100), 2), 0) AS totalCalories,
                                    IFNULL(ROUND(SUM(foodData.caffeine * meals.amount/100), 2), 0) AS totalCaffeine,
                                    IFNULL(ROUND(SUM(foodData.sugars * meals.amount/100), 2), 0) AS totalSugar,
                                    IFNULL(ROUND(SUM(foodData.fiber * meals.amount/100), 2), 0) AS totalFiber,
                                    IFNULL(ROUND(SUM(foodData.calcium * meals.amount/100), 2), 0) AS totalCalcium,
                                    IFNULL(ROUND(SUM(foodData.iron * meals.amount/100), 2), 0) AS totalIron,
                                    IFNULL(ROUND(SUM(foodData.magnesium * meals.amount/100), 2), 0) AS totalMagnesium,
                                    IFNULL(ROUND(SUM(foodData.phosphorus * meals.amount/100), 2), 0) AS totalPhosphorus,
                                    IFNULL(ROUND(SUM(foodData.potassium * meals.amount/100), 2), 0) AS totalPotassium,
                                    IFNULL(ROUND(SUM(foodData.sodium * meals.amount/100), 2), 0) AS totalSodium,
                                    IFNULL(ROUND(SUM(foodData.zinc * meals.amount/100), 2), 0) AS totalZinc,
                                    IFNULL(ROUND(SUM(foodData.copper * meals.amount/100), 2), 0) AS totalCopper,
                                    IFNULL(ROUND(SUM(foodData.selenium * meals.amount/100), 2), 0) AS totalSelenium,
                                    IFNULL(ROUND(SUM(foodData.vitamin_A * meals.amount/100), 2), 0) AS totalVitaminA,
                                    IFNULL(ROUND(SUM(foodData.vitamin_E * meals.amount/100), 2), 0) AS totalVitaminE,
                                    IFNULL(ROUND(SUM(foodData.vitamin_D * meals.amount/100), 2), 0) AS totalVitaminD,
                                    IFNULL(ROUND(SUM(foodData.vitamin_C * meals.amount/100), 2), 0) AS totalVitaminC,
                                    IFNULL(ROUND(SUM(foodData.thiamin * meals.amount/100), 2), 0) AS totalThiamin,
                                    IFNULL(ROUND(SUM(foodData.riboflavin * meals.amount/100), 2), 0) AS totalRiboflavin,
                                    IFNULL(ROUND(SUM(foodData.niacin * meals.amount/100), 2), 0) AS totalNiacin,
                                    IFNULL(ROUND(SUM(foodData.vitamin_B6 * meals.amount/100), 2), 0) AS totalVitaminB6,
                                    IFNULL(ROUND(SUM(foodData.folate * meals.amount/100), 2), 0) AS totalFolate,
                                    IFNULL(ROUND(SUM(foodData.vitamin_B12 * meals.amount/100), 2), 0) AS totalVitaminB12,
                                    IFNULL(ROUND(SUM(foodData.choline * meals.amount/100), 2), 0) AS totalCholine,
                                    IFNULL(ROUND(SUM(foodData.vitamin_K * meals.amount/100), 2), 0) AS totalVitaminK,
                                    IFNULL(ROUND(SUM(foodData.cholesterol * meals.amount/100), 2), 0) AS totalCholesterol,
                                    IFNULL(ROUND(SUM(foodData.fatty_acids_total_saturated * meals.amount/100), 2), 0) AS totalSaturated,
                                    IFNULL(ROUND(SUM(foodData.LA * meals.amount/100), 2), 0) AS totalLA,
                                    IFNULL(ROUND(SUM(foodData.ALA * meals.amount/100), 2), 0) AS totalALA,
                                    IFNULL(ROUND(SUM(foodData.DHA * meals.amount/100), 2), 0) AS totalDHA,
                                    IFNULL(ROUND(SUM(foodData.EPA * meals.amount/100), 2), 0) AS totalEPA,
                                    IFNULL(ROUND(SUM(foodData.fatty_acids_total_monounsaturated * meals.amount/100), 2), 0) AS totalMonoUnsaturated,
                                    IFNULL(ROUND(SUM(foodData.fatty_acids_total_polyunsaturated * meals.amount/100), 2), 0) AS totalPolyUnsaturated
                                FROM meals
                                JOIN foodData ON meals.product_id = foodData.id
                                WHERE meals.date = ?`;
                tx.executeSql(query, [dateString], async (tx, results) =>{
                    const totalNutrients = results.rows.item(0);
                    
                    if(selectedDay.day === currentDayInfo.day && selectedDay.month === currentDayInfo.month && selectedDay.year === currentDayInfo.year)
                    {
                       await saveTodaysNutrients(currentDayInfo, totalNutrients);
                    } 

                    setSelectedDayNutrients(totalNutrients);
                    
                    console.log('Food Data Loaded: ', foodDataLoaded);
                    if(!foodDataLoaded){
                        setFoodDataLoaded(true);
                    }
                },(tx,error) =>{
                    console.error(error);
                });
            })
        } catch (error) {
          console.log(error);          
        }
  };

  const saveTodaysNutrients = async (currentDayInfo, totalNutrients) => {
    console.log('Data aktualna, zapisuje dane o wartościach odżywczych.');
    const todayCalories = totalNutrients.totalCalories;
    setTodayCalories(todayCalories);
    const lastSavedNutrients = {
        date: currentDayInfo,
        nutrients: totalNutrients
    }
    await AsyncStorage.setItem('lastSavedNutrients', JSON.stringify(lastSavedNutrients));
  }


  useEffect(() => {

    if(foodData && gameDataLoaded){
        console.log('SPRAWDZANIE DANYCH O POSIŁKACH I WARTOŚCIACH SPOŻYWCZYCH');
        getDayMeals(); 
        getDayNutrients();
        console.log('');
    }
  }, [selectedDay, foodData, gameDataLoaded]);





    const memoizedValues = useMemo(() => {
        return {
            foodData, mealsData, getDayMeals, getDayNutrients
        }
    }, [foodData, mealsData]);
    
    return (
        <FoodDataContext.Provider
            value={
                memoizedValues
            }
        >
        {children}
        </FoodDataContext.Provider>
    )
}