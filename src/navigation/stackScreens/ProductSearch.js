import {View, Keyboard, StatusBar, useWindowDimensions, TouchableWithoutFeedback} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { useFoodData } from '../../providers/FoodDataProvider';
import { useSelectedDay } from '../../providers/CommonDataProvider';
import ProductAmountModal from '../../components/common/ProductAmountModal';
import ProductSearchInput from '../../components/common/ProductSearchInput';
import { colors } from '../../styles/global';
import ProductList from '../../components/common/ProductList';


export default function ProductSearch() {
    console.log('ProductSearch render')
    const { foodData } = useFoodData();

    const screenHeight = useWindowDimensions().height;

    const resultsPerPage = 25;
    const [ currentPage, setCurrentPage ] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [selectedItemProtein, setSelectedItemProtein] = useState(null);
    const [selectedItemCarbohydrates, setSelectedItemCarbohydrates] = useState(null);
    const [selectedItemFat, setSelectedItemFat] = useState(null);
    const [selectedItemEnergy, setSelectedItemEnergy] = useState(null);

    const [searchLoading, setSearchLoading] = useState(false);
    const [firstPageLoaded, setFirstPageLoaded] = useState(false);
    const [ isMoreData, setMoreData] = useState(true);


    const route = useRoute();
    const { mealName } = route.params;
    const { selectedDay } = useSelectedDay();

    useEffect(() => {
        setCurrentPage(1);
        setSearchLoading(true);
        setMoreData(true);
        setFirstPageLoaded(false);
        setFilteredData([]);

        if(searchTerm.length >= 2) {
            filterData(searchTerm, 1);
            
        } else {
            setSearchLoading(false);
        }

    }, [searchTerm])
 
    

    const filterData = async (searchTerm, page) => {
        try {
            foodData.transaction((tx) => {
                const offset = (page - 1) * resultsPerPage;
                const resultsCount = firstPageLoaded ? resultsPerPage : resultsPerPage * 2;
                const query = `
                    SELECT id, name, protein, total_fat, carbohydrates, energy 
                    FROM foodData 
                    WHERE name LIKE ?
                    ORDER BY 
                        CASE 
                            WHEN name LIKE ? THEN 0 -- Match at the beginning
                            WHEN name LIKE '%' || ? THEN 1 -- Match anywhere else
                            ELSE 2 -- No match
                        END, 
                        name
                    LIMIT ? OFFSET ?
                `;
                const params = [`%${searchTerm}%`, `${searchTerm},%`, `${searchTerm}%`, resultsCount, offset];

        
                tx.executeSql(query, params, (tx, results) => {
                    const rows = results.rows;
                    const data = [];
    
                    if(rows.length > 0){
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i));
                        }
                    } else {
                        setMoreData(false)
                    }
                    setFilteredData((prevData) => [...prevData, ...data]);
                    setSearchLoading(false);
                    setFirstPageLoaded(true);
                },
                (error) => {
                    console.error('Error executing SQL query:', error);
                });
            });
        } catch (error) {
            console.error(error)
        }
        
    }

    const openModal = useCallback((id, name, protein, carbohydrates, fat, energy) => {
        setSelectedItemId(id)
        setSelectedItemName(name);
        setSelectedItemProtein(protein);
        setSelectedItemCarbohydrates(carbohydrates);
        setSelectedItemFat(fat);
        setSelectedItemEnergy(energy);
        setModalVisible(true);
    }, [])

    const handleEndReached = useCallback(() => {
        
        if(isMoreData && firstPageLoaded && !searchLoading){
            setSearchLoading(true);
            setCurrentPage((prevPage) => prevPage + 1);
            filterData(searchTerm, currentPage + 1);
        }
    },[isMoreData, firstPageLoaded, searchLoading])

    


    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>
                <StatusBar backgroundColor={colors.BLUE} barStyle='light-content'/>
                <View style={{height: '12%', backgroundColor: colors.BLUE, justifyContent: 'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                    <ProductSearchInput 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </View>

                <ProductList filteredData={filteredData} openModal={openModal} handleEndReached={handleEndReached} searchLoading={searchLoading}/>

                <ProductAmountModal
                    selectedItemId={selectedItemId}
                    selectedItemName={selectedItemName}
                    selectedItemProtein={selectedItemProtein}
                    selectedItemCarbohydrates={selectedItemCarbohydrates}
                    selectedItemFat={selectedItemFat}
                    selectedItemEnergy={selectedItemEnergy}
                    amount={100}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    selectedDay={selectedDay}
                    mealName={mealName}
                    inputType={'addProduct'}
                />
            </View>
        </TouchableWithoutFeedback>
    )
}