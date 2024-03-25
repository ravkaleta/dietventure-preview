import AsyncStorage from "@react-native-async-storage/async-storage";

const updateAttributes = async (daysDiff, userData, nutrients, nutrientsIntake) => {
    const maxDailyAttributeValueChange = 0.43;
    
    const nutrientsFulfilledPercetage = {
        omega3: (nutrients.totalALA + nutrients.totalDHA + nutrients.totalEPA) / nutrientsIntake.totalOmega3Intake,
        omega6: nutrients.totalLA / nutrientsIntake.totalOmega6Intake,

        vitaminA:   nutrients.totalVitaminA / nutrientsIntake.totalVitaminA,
        thiamin:    nutrients.totalThiamin / nutrientsIntake.totalThiamin,
        riboflavin: nutrients.totalRiboflavin / nutrientsIntake.totalRiboflavin,
        niacin:     nutrients.totalNiacin / nutrientsIntake.totalNiacin,
        vitaminB6:  nutrients.totalVitaminB6 / nutrientsIntake.totalVitaminB6,
        vitaminB12: nutrients.totalVitaminB12 / nutrientsIntake.totalVitaminB12,
        vitaminC:   nutrients.totalVitaminC / nutrientsIntake.totalVitaminC,
        vitaminD:   nutrients.totalVitaminD / nutrientsIntake.totalVitaminD,
        vitaminE:   nutrients.totalVitaminE / nutrientsIntake.totalVitaminE,
        vitaminK:   nutrients.totalVitaminK / nutrientsIntake.totalVitaminK,
        folate:     nutrients.totalFolate / nutrientsIntake.totalFolate,
        choline:    nutrients.totalCholine / nutrientsIntake.totalCholine,

        calcium:    nutrients.totalCalcium / nutrientsIntake.totalCalcium,
        iron:       nutrients.totalIron / nutrientsIntake.totalIron,
        magnesium:  nutrients.totalMagnesium / nutrientsIntake.totalMagnesium,
        phosphorus: nutrients.totalPhosphorus / nutrientsIntake.totalPhosphorus,
        potassium:  nutrients.totalPotassium / nutrientsIntake.totalPotassium,
        sodium:     nutrients.totalSodium / nutrientsIntake.totalSodium,
        zinc:       nutrients.totalZinc / nutrientsIntake.totalZinc,
        copper:     nutrients.totalCopper / nutrientsIntake.totalCopper,
        selenium:   nutrients.totalSelenium / nutrientsIntake.totalSelenium,
    }

    console.log('Procentowe wartości spełnionego zapotrzebowania na witaminy i minerały: ', nutrientsFulfilledPercetage);

    const nutrientFactor = {};

    for(const nutrient in nutrientsFulfilledPercetage){
        const newValue = Math.min(Math.max(nutrientsFulfilledPercetage[nutrient] - 0.75, -0.25), 0.25);
        nutrientFactor[nutrient] = newValue;
    }

    const vitalityChangeValue = (nutrientFactor.niacin + nutrientFactor.vitaminB6 + nutrientFactor.vitaminB12 + 
                                nutrientFactor.vitaminE + nutrientFactor.folate + nutrientFactor.calcium +
                                nutrientFactor.iron + nutrientFactor.phosphorus + nutrientFactor.potassium +
                                nutrientFactor.selenium + nutrientFactor.omega3 + nutrientFactor.omega6) / 12 / 0.25 * maxDailyAttributeValueChange;

    const perceptionChangeValue =   (nutrientFactor.vitaminA + nutrientFactor.riboflavin + nutrientFactor.vitaminC +
                                     nutrientFactor.zinc + nutrientFactor.omega3) / 5 / 0.25 * maxDailyAttributeValueChange;
    
    const wisdomChangeValue =  (nutrientFactor.choline + nutrientFactor.vitaminD + nutrientFactor.folate + 
                                nutrientFactor.magnesium + nutrientFactor.potassium + nutrientFactor.zinc + 
                                nutrientFactor.omega3) / 7 / 0.25 * maxDailyAttributeValueChange;

    const concentrationChangeValue = (nutrientFactor.thiamin + nutrientFactor.choline + nutrientFactor.iron +
                                    nutrientFactor.magnesium + nutrientFactor.potassium + nutrientFactor.omega3) / 6 / 0.25 * maxDailyAttributeValueChange;

    const reflexChangeValue =   (nutrientFactor.niacin + nutrientFactor.choline + nutrientFactor.vitaminB6 +
                                 nutrientFactor.vitaminB12 + nutrientFactor.phosphorus + nutrientFactor.sodium) / 6 / 0.25 * maxDailyAttributeValueChange;

    const regenerationChangeValue = (nutrientFactor.vitaminA + nutrientFactor.vitaminC + nutrientFactor.vitaminD +
                                     nutrientFactor.vitaminE + nutrientFactor.vitaminK + nutrientFactor.zinc + 
                                     nutrientFactor.copper + nutrientFactor.omega3) / 8 / 0.25 * maxDailyAttributeValueChange;

    console.log('Stare wartości atrybutów: \n',
                'VIT: ', userData.attributes.vitality.value,
                ' PER: ', userData.attributes.perception.value,
                ' WIS: ', userData.attributes.wisdom.value,
                ' CON: ', userData.attributes.concentration.value,
                ' REF: ', userData.attributes.reflex.value,
                ' REG: ', userData.attributes.regeneration.value)

    console.log('Wartośi dostosowujące: \n',
                ' VIT(change): ', vitalityChangeValue,
                ' PER(change): ', perceptionChangeValue,
                ' WIS(change): ', wisdomChangeValue,
                ' CON(change): ', concentrationChangeValue,
                ' REF(change): ', reflexChangeValue,
                ' REG(change): ', regenerationChangeValue);

    var newVitalityValue =        Math.min(Math.max(userData.attributes.vitality.value + vitalityChangeValue          , 1), 10);
    var newPerceptionValue =      Math.min(Math.max(userData.attributes.perception.value + perceptionChangeValue      , 1), 10);
    var newWisdomValue =          Math.min(Math.max(userData.attributes.wisdom.value + wisdomChangeValue              , 1), 10);
    var newConcentrationValue =   Math.min(Math.max(userData.attributes.concentration.value + concentrationChangeValue, 1), 10);
    var newReflexValue =          Math.min(Math.max(userData.attributes.reflex.value + reflexChangeValue              , 1), 10);
    var newRegenerationValue =    Math.min(Math.max(userData.attributes.regeneration.value + regenerationChangeValue  , 1), 10);

    console.log('Nowe wartości atrybutów: \n',
                'VIT: ', newVitalityValue,
                ' PER: ', newPerceptionValue,
                ' WIS: ', newWisdomValue,
                ' CON: ', newConcentrationValue,
                ' REF: ', newReflexValue,
                ' REG: ', newRegenerationValue)

    const missedDays = daysDiff - 1;
    console.log('Opusczone dni od ostatniego zapisu: ', missedDays)
    if(missedDays > 0)
    {
        newVitalityValue = Math.max(newVitalityValue - missedDays * maxDailyAttributeValueChange, 1);
        newPerceptionValue = Math.max(newPerceptionValue - missedDays * maxDailyAttributeValueChange, 1);
        newWisdomValue = Math.max(newWisdomValue - missedDays * maxDailyAttributeValueChange, 1);
        newConcentrationValue = Math.max(newConcentrationValue - missedDays * maxDailyAttributeValueChange, 1);
        newReflexValue = Math.max(newReflexValue - missedDays * maxDailyAttributeValueChange, 1);
        newRegenerationValue = Math.max(newRegenerationValue - missedDays * maxDailyAttributeValueChange, 1);

        console.log('Ostateczne wartości atrybutów: \n',
                'VIT: ', newVitalityValue,
                'PER: ', newPerceptionValue,
                'WIS: ', newWisdomValue,
                'CON: ', newConcentrationValue,
                'REF: ', newReflexValue,
                'REG: ', newRegenerationValue, '\n')
    }

    userData.attributes.vitality.value = newVitalityValue;
    userData.attributes.perception.value = newPerceptionValue;
    userData.attributes.wisdom.value = newWisdomValue;
    userData.attributes.concentration.value = newConcentrationValue;
    userData.attributes.reflex.value = newReflexValue;
    userData.attributes.regeneration.value = newRegenerationValue;

    console.log('Zapisywanie nowych wartości do AsyncStorage.')
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
}







const updateAttributesFromTrainings = async(daysDiff, userData, trainings) => {
    const dailyAttributeChange = 0.33;
    const dailyConsistencyChange = 0.1;
    var strength = userData.attributes.strength;
    var endurance = userData.attributes.endurance;
    var agility = userData.attributes.agility;
    const agilityConsistency = agility.consistency;

    console.log('Ostatnie zapisane treningi: \n',
                'Siłowy: ', trainings.strength, ' Cardio: ', trainings.cardio);

    console.log('Stare wartości atrybutów: \n',
                'STR: ', strength,
                ' END: ', endurance,
                ' AGI: ', agility)

    if(trainings.cardio){
        endurance.value = Math.min(endurance.value + dailyAttributeChange + endurance.consistency, 10);
        endurance.consistency += Math.min(dailyConsistencyChange, 1);
        agility.value = Math.min(agility.value + dailyAttributeChange/2 + agilityConsistency/2, 10);
        agility.consistency += Math.min(dailyConsistencyChange/2, 1);
    }

    if(trainings.strength){
        strength.value = Math.min(strength.value + dailyAttributeChange + strength.consistency, 10);
        strength.consistency += Math.min(dailyConsistencyChange, 1);
        agility.value = Math.min(agility.value + dailyAttributeChange/2 + agilityConsistency/2, 10);
        agility.consistency += Math.min(dailyConsistencyChange/2, 1);
    }
    
    console.log('Nowe wartości atrybutów: \n',
                'STR: ', strength,
                ' END: ', endurance,
                ' AGI: ', agility)

    const missedTrainings = Math.floor(daysDiff / 3);
    console.log('Opusczone dni od ostatniego zapisu: ', missedTrainings)
    if(missedTrainings > 0){
        let enduranceConsistencyDrop = endurance.consistency;
        let strengthConsistencyDrop = strength.consistency;
        let agilityConsistencyDrop = agility.consistency;

        for(let i = 1; i <= missedTrainings; i++){
            enduranceConsistencyDrop += endurance.consistency;
            endurance.consistency = Math.max(0, endurance.consistency - dailyConsistencyChange);
            strengthConsistencyDrop += strength.consistency;
            strength.consistency -= Math.max(0, strength.consistency - dailyConsistencyChange);
            agilityConsistencyDrop =+ agility.consistency;
            agility.consistency -= Math.max(0, agility.consistency - dailyConsistencyChange);
        }

        endurance.value = Math.max(1, endurance.value - dailyAttributeChange * missedTrainings + enduranceConsistencyDrop);
        agility.value = Math.max(1, agility.value - dailyAttributeChange * missedTrainings + agilityConsistencyDrop);
        strength.value = Math.max(1, strength.value - dailyAttributeChange * missedTrainings + strengthConsistencyDrop);

        console.log('Ostateczne wartości atrybutów: \n',
                    'STR: ', strength,
                    ' END: ', endurance,
                    ' AGI: ', agility)

    }

    userData.attributes.strength = strength;
    userData.attributes.endurance = endurance;
    userData.attributes.agility = agility;

    console.log('Zapisywanie nowych wartości do AsyncStorage.')
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
}

export { updateAttributes, updateAttributesFromTrainings };