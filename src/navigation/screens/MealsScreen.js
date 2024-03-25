import { View } from "react-native";

import Header from "../../components/mealsScreen/mealsHeader";
import CharacterOrMeals from "../../components/common/CharacterOrMeals";
import { colors } from "../../styles/global";

export default function MealsScreen() {
  const selectedScreen = 'Meals';
  console.log('MealsScreen render')
    return(
      <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>

        <Header/>
        <CharacterOrMeals selectedScreen= {selectedScreen}/>
          
      </View>
    );
}
