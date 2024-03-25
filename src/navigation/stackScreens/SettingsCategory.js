import {View, StatusBar} from 'react-native';
import BodyMeasurement from './settingsViews/BodyMeasurement';
import Target from './settingsViews/Target';
import Summary from './settingsViews/Summary';
import { colors } from '../../styles/global';
import Developer from './settingsViews/Developer';

export default function SettingsCategory({route}){
    

    const { category } = route.params;
    
    return(
        <View style={{flex: 1, backgroundColor: colors.stackScreenBackgroundColor}}>
            <StatusBar backgroundColor= {colors.BLUE} barStyle="light-content"/>
            {renderCategoryView(category)}
        </View>
    )
}

function renderCategoryView(category){
    switch(category){
        case 'bodyMeasurement':
            return <BodyMeasurement/>;
        case 'target':
            return <Target/>;
        case 'summary': 
            return <Summary/>;
        case 'developer':
            return <Developer/>;
    }
}