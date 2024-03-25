import { View, ActivityIndicator, Image } from "react-native"
import { colors } from "../../styles/global"

export default function LoadingScreen () {

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundColor}}>
            <View style={{width: '90%', height: '50%'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Image source={require('../../assets/images/AppLogo.png')} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
                </View>
                <ActivityIndicator size={80} color='gray' style={{flex: 1, backgroundColor: 'transparent'}}/>
            </View>
        </View>
    )
}