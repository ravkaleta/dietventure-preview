import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";

const ProductSearchInput = React.memo(({setSearchTerm}) => {
    console.log('ProductSearchInput render');

    const [tempSearchTerm, setTempSearchTerm] = useState('');

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            setSearchTerm(tempSearchTerm);      
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [tempSearchTerm])


    const handleProductInputChange = (value) => {
        setTempSearchTerm(value);
    };

    return (
        <TextInput
                style={{ 
                    width: '80%',
                    height: 40,
                    alignSelf: 'center',
                    borderRadius: 5,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    backgroundColor: 'white',
                    color: 'black',
                }}
                placeholderTextColor='gray'
                placeholder="Enter the product name"
                value={tempSearchTerm}
                onChangeText={handleProductInputChange}
            />
    )
});

export default ProductSearchInput;