import { View, Text, Image } from "react-native";
import { useUserGold } from "../../../providers/CommonDataProvider";

export default function Gold() {
    console.log('Gold render')

    const { gold } = useUserGold();

    return (
        <View style={{alignItems: 'center'}}>
            <Image source={require('../../../assets/images/goldIcon.png')}  style={{width: '60%', height: '65%'}}/>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold'}}>{gold}g</Text>
        </View>
    )
}