import AsyncStorage from "@react-native-async-storage/async-storage";
import gameEvents from "../constants/gameEvents";

export const addGameEvent = (currentHealth, maxHealth, attributes, userDMG, enemyParam, encounterParam) => {
    //console.log('XXXXXXXXXXXXX', enemyParam, encounterParam)
    let userHP = currentHealth;
    let isEnemy = enemyParam;
    let isEncounter = encounterParam;
    let gainedGold = 0;
    let gameEventText = 'Something went wrong';
    let eventTitle = '';

    const encounterLogs = [];

    if(isEnemy){
        //console.log(enemy);
        eventTitle = isEnemy.title;
        const enemy = isEnemy.enemy;
        let enemyHP = enemy.hp;
        
        while( userHP > 0 && enemyHP > 0){
            encounterLogs.push(`${userHP}HP You ⚔ ${enemy.name} ${enemyHP}HP`);

            const userDamageDealt = randomInt(userDMG[0], userDMG[1]);
            enemyHP = Math.max(0, enemyHP - userDamageDealt);
            const encounterLog = `You dealt ${userDamageDealt}DMG!`;
            encounterLogs.push(encounterLog);

            if(enemyHP > 0) {
                encounterLogs.push(`${userHP}HP You ⚔ ${enemy.name} ${enemyHP}HP`);

                let enemyDamageDealt = randomInt(enemy.dmg[0], enemy.dmg[1]);

                const encounterLog = `${enemy.name} dealt ${enemyDamageDealt}DMG!`;
                encounterLogs.push(encounterLog);

                const armor = parseInt(attributes.agility.value);
                const blockedDamage = Math.min(randomInt(0, armor), enemyDamageDealt);

                if(blockedDamage > 0){
                    enemyDamageDealt = Math.max(0, enemyDamageDealt - blockedDamage);

                    if(enemyDamageDealt === 0) {
                        const damageBlockedLog = `🛡 You have fully blocked incoming attack! 🛡`;
                        encounterLogs.push(damageBlockedLog);
                    } else {
                        const damageBlockedLog = `You blocked ${blockedDamage}🛡(Agility) DMG!`;
                        encounterLogs.push(damageBlockedLog);
                    }
                }
                
                userHP = Math.max(0, userHP - enemyDamageDealt);
                
                
            }
        }
        encounterLogs.push(`${userHP}HP You ⚔ ${enemy.name} ${enemyHP}HP`);
        
        if(enemyHP <= 0){
            gainedGold = randomInt(enemy.gold[0], enemy.gold[1]);
            gameEventText = `You won the battle and gained ${gainedGold} gold!`;
        } else {
            gameEventText = `You lost the battle.`
        }
        isEnemy = null;
    }else if(isEncounter){
        eventTitle = isEncounter.title;
        const encounter = isEncounter;
        const userRequiredAttribute = attributes[encounter.attribute].value;
        const userRequiredAttributeValue = parseInt(userRequiredAttribute);
        const encounterDifficulty = randomInt(encounter.difficulty[0], encounter.difficulty[1]);
        const userThrow = randomInt(1,9);
        encounterLogs.push(`Encounter difficulty: ${encounterDifficulty}`);
        encounterLogs.push(`Your throw ${userThrow}🎲 + ${userRequiredAttributeValue}(${encounter.attribute.substring(0,3).toUpperCase()})`);

        if(userThrow + userRequiredAttributeValue > encounterDifficulty){
            gameEventText = encounter.outcomes.success.description;
            if(encounter.outcomes.success.gold){
                gainedGold = randomInt(encounter.outcomes.success.gold[0], encounter.outcomes.success.gold[1]);
                const outcomeLog = `You have gainded ${gainedGold} gold!`;
                encounterLogs.push(outcomeLog);
            }
            if(encounter.outcomes.success.hp){
                const heal = randomInt(encounter.outcomes.success.hp[0], encounter.outcomes.success.hp[1]);
                userHP = Math.min(userHP + heal, maxHealth);
                const outcomeLog = `You have been healed by ${heal} health points!`;
                encounterLogs.push(outcomeLog);
            }
        } else {
            gameEventText = encounter.outcomes.fail.description;
            if(encounter.outcomes.fail.dmg){
                const damageDealt = randomInt(encounter.outcomes.fail.dmg[0], encounter.outcomes.fail.dmg[1]);
                userHP = (Math.max(0, userHP - damageDealt));
                const outcomeLog = `You have lost ${damageDealt} health points!`;
                encounterLogs.push(outcomeLog);
            }
            if(encounter.outcomes.fail.gold){
                gainedGold = randomInt(encounter.outcomes.fail.gold[0], encounter.outcomes.fail.gold[1]);
                const outcomeLog = `You have gainded ${gainedGold} gold!`;
                encounterLogs.push(outcomeLog);
            }
            if(encounter.outcomes.fail.hp){
                const heal = randomInt(encounter.outcomes.fail.hp[0], encounter.outcomes.fail.hp[1]);
                userHP = Math.min(userHP + heal, maxHealth);
                const outcomeLog = `You have been healed by ${heal} health points!`;
                encounterLogs.push(outcomeLog);
            }
        }
        isEncounter = null;
    } else {
        const event = getEventById(randomInt(4,15));

        switch (event.category) {
            case 'Information':
                eventTitle = event.title;
                break;
            case 'Enemy':
                gameEventText = `You've encountered ${event.enemy.name} on your way!`
                isEnemy = event;
                break;
            case 'Encounter':
                gameEventText = event.description;
                isEncounter = event;
                break;
            default:
                break;
        }
    }
    //console.log(userHP, enemy, encounter, gainedGold, gameEventText, encounterLogs)
        
    return { userHP, isEnemy, isEncounter, gainedGold, eventTitle, gameEventText, encounterLogs}
}

export const addGameLogsToStorage = async(gameStarted, currentDate, currentHealth, newGameLogs, lastEnemy, lastEncounter) => {

    console.log(currentHealth)
    console.log('NEW GAME LOGS', newGameLogs);

    const formattedDate = currentDate.toISOString();

    const gameLogsData = {
        gameStarted: gameStarted,
        date: formattedDate,
        lastSavedHealthValue: currentHealth,
        lastEnemy: lastEnemy,
        lastEncounter: lastEncounter,
        gameLogs: newGameLogs,
    }

    const serializedGameLogsData = JSON.stringify(gameLogsData);
    
    await AsyncStorage.setItem('gameLogs', serializedGameLogsData);
}


const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getEventById = (eventId) => {
    const event = gameEvents.find((e) => e.id === eventId);
    if (event) {
        return event
    } else {
        return 'Nie znaleziono wydarzenia o podanym ID.';
    }
}