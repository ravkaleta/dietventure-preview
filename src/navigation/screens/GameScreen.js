
import { View} from 'react-native';
import CharacterHeader from '../../components/characterScreen/characterHeader';

import GameView from '../../components/gameScreen/gameView';
import { colors } from '../../styles/global';

export default function GameScreen() {
    console.log('GameScreen render')

    return(
        <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>

            <CharacterHeader/>
            <GameView/>
            
        </View>
    )
}
