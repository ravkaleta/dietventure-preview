import {View, Text, useWindowDimensions, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';

const ProductList = React.memo(({ filteredData, openModal, handleEndReached, searchLoading}) => {

    console.log('ProductList render')

    const screenHeight = useWindowDimensions().height;

    const ProductItem = ({item}) => (
        <TouchableOpacity 
            style={{ paddingVertical: screenHeight / 50, marginBottom: 2, alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)'}} 
            onPress={() => openModal(item.id, item.name, item.protein, item.carbohydrates, item.total_fat, item.energy)}
        > 
            <Text style={{fontSize: 16, color: 'white', flex: 5, paddingHorizontal: 10}}>{item.name} </Text>
            <Text style={{flex: 1, color: 'white', textAlign: 'center'}}>{item.energy}kcal</Text>
        </TouchableOpacity>
    )


    return(
        <FlatList
                // onEndReachedThreshold={0.2}
                keyboardShouldPersistTaps='always'
                keyboardDismissMode='on-drag'
                onEndReached={handleEndReached}
                data={filteredData}
                keyExtractor={(item, index ) => index.toString()}
                renderItem={({ item }) => <ProductItem item={item}/>}
                ListFooterComponent={() =>(
                    <View>
                        {searchLoading && <ActivityIndicator size='large' color='gray'/>}
                    </View>
                )}
            />
    )
})

export default ProductList;