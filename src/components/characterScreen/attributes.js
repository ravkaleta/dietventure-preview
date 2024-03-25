import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import { useUserAttributes } from '../../providers/CommonDataProvider';
import { strIcon, agiIcon, endIcon, vitIcon, regIcon, perIcon, wisIcon, conIcon, refIcon } from '../../constants/attributeIcons';
import { colors } from '../../styles/global';

export default function Attributes() {
  console.log('Attributes render');

  const windowHeight = Dimensions.get('window').height;

  const { userAttributes } = useUserAttributes();

  const Attributes= [
    [{
      name: "STR",
      value: userAttributes.strength.value,
      image: strIcon
    },
    {
      name: "AGI",
      value: userAttributes.agility.value,
      image: agiIcon
    },
    {
      name: "END",
      value: userAttributes.endurance.value,
      image: endIcon
    }],
    [{
      name: "VIT",
      value: userAttributes.vitality.value,
      image: vitIcon
    },
    {
      name: "REG",
      value: userAttributes.regeneration.value,
      image: regIcon
    }],
    [{
      name: "PER",
      value: userAttributes.perception.value,
      image: perIcon
    },
    {
      name: "WIS",
      value: userAttributes.wisdom.value,
      image: wisIcon
    }],
    [{
      name: "CON",
      value: userAttributes.concentration.value,
      image: conIcon
    },
    {
      name: "REF",
      value: userAttributes.reflex.value,
      image: refIcon
    }],
  ]


  const AtttributeItem_threeInRow = ({attribute}) => {

    return (
      <View style={styles.attribute}>
        <View style={styles.progressAndValue}>
          <Progress.Circle color='white' progress={attribute.value - Math.floor(attribute.value)} size={35}/>                 
            <Text style= {[styles.attributeValue]}>{Math.floor(attribute.value)}</Text>   
        </View>
        <View style={{flex: 1, alignItems: 'center' }}>
          <Image source={attribute.image}  style={{flex: 1, resizeMode: 'contain', width: '100%', height: '100%'}}/>
          <Text style={styles.attributeName}>{attribute.name}</Text>
        </View>
      </View>
    )
  }

  const AtttributeItem_twoInRow = ({attribute}) => {

    return (
      <View style={styles.attribute}>
        <View style={styles.progressAndValue}>
          <Progress.Circle color='white' progress={attribute.value - Math.floor(attribute.value)} size={35}/>                 
            <Text style= {[styles.attributeValue]}>{Math.floor(attribute.value)}</Text>   
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={attribute.image}  style={{flex: 1, resizeMode: 'contain', width: '100%', height: '100%'}}/>
          <Text style={styles.attributeName}>{attribute.name}</Text>
        </View>
      </View>
    )
  }

  const text = 'ATTRIBUTES';
  
    return (
        <View style={styles.container}>    
          <View style={{position: 'absolute', width: '35%', height: '60%', left: '-15%', backgroundColor:'transparent'}}></View>
          <Text style={[styles.attributeText,{height: windowHeight* 0.3}]}>{text.split('').join('\n')}</Text>

          <View style={[styles.attributes]}>
          {Attributes.map((attributeRow, index) => (
            <View key={index} style={[styles.attributeRow]}>

              {index === 0 ? attributeRow.map((attribute, index) => (
                <AtttributeItem_threeInRow key={index} attribute={attribute}/>
          ))
          : attributeRow.map((attribute, index) => (
                <AtttributeItem_twoInRow key={index} attribute={attribute}/>
          ))}
            </View>
          ))}
          </View>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        height: '100%'
      },
      attributeText: {
        textAlignVertical: 'center',
        textAlign: 'center',
        width: '15%',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'white',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderLeftWidth: 1,
        borderColor: colors.YELLOW_WHITE,
      },
      attributes: {
        height: '90%',
        width: '85%',
        //marginRight: '4%',
        flexDirection: 'column',
        //backgroundColor: 'rgba(0,0,0,0.3)',
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 10,
        borderLeftWidth: 2,
        //borderTopWidth: 2,
        //borderBottomWidth: 2,
        borderColor: 'rgba(240,240,240,1)',
      },
      attributeRow: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '3%',
        marginRight: '3%',
        borderBottomWidth: 1,
        borderColor: 'rgba(240,240,240,1)'
      },
      attribute: {
        flex: 1
      },
      progressAndValue: {
        alignItems: 'center',
        justifyContent:'center',
        flex: 1
      },
      attributeName: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
      },
      attributeValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        position: 'absolute'
      },
      imageBox: {
        flex: 1,
        //backgroundColor: 'blue'
      },
      image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
      }


  });