import React, {createContext, useContext, useEffect, useMemo} from 'react';

import gameEvents from '../constants/gameEvents';
import { useGameData } from './GameDataProvider';
import { useCharacterStats, useCurrentEnergy, useCurrentHealth, useGameLogs, useUserAttributes, useUserGold } from './CommonDataProvider';
import { months } from '../constants/calendar';
import { addGameEvent, addGameLogsToStorage } from '../utils/addGameEvent';

const GameLogicContext = createContext();

export function useGameLogic() {
    return useContext(GameLogicContext);
}

export function GameLogicProvider({children}) {
    console.log('GameLogic load');

    const { 
        gameStarted, setGameStarted,
        updateHealth, currentEnemy, setCurrentEnemy,
        currentEncounter, setCurrentEncounter } = useGameData();

    const { gold, setGold, updateGold } = useUserGold();
    const { currentHealth} = useCurrentHealth();
    const { currentEnergy } = useCurrentEnergy();

    const { userAttributes } = useUserAttributes();

    const { gameLogs, setGameLogs} = useGameLogs();


    const { maxHealth, characterDamage, newEventRate} = useCharacterStats();
    //const [ newGameEvent, setNewGameEvent] = useState(null);
    

    //GŁÓWNA PĘTLA GRY
    useEffect(() => {
        let intervalId;

        if(gameStarted){
            
            intervalId = setInterval(async () => {
                const currentDate = new Date;
                const dateString = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

                const gameEvent = {
                    date: currentDate.toISOString(),
                    title: '',
                    text: 'Something went wrong',
                    encounterLogs: [],
                    expanded: false
                };

                let gameStarted = true;
                let lastEnemy = null;
                let lastEncounter = null;
                console.log('CURRENT HEALTH ', currentHealth);
                
                if(currentEnemy || currentEncounter || (currentHealth > 0 && currentEnergy > 0)){
                    //console.log('XXXXXXXXXXXXXXXXXXXXXXXX', currentEnemy, currentEncounter, currentHealth, currentEnergy);
                    const { userHP, isEnemy, isEncounter, gainedGold, eventTitle, gameEventText, encounterLogs } = addGameEvent(currentHealth, maxHealth, userAttributes, characterDamage, currentEnemy, currentEncounter);

                    lastEnemy = isEnemy;
                    lastEncounter = isEncounter;

                    if(eventTitle){
                        gameEvent.title = eventTitle;
                    }
                    gameEvent.text = gameEventText;
                    gameEvent.encounterLogs = encounterLogs;

                    if(userHP != currentHealth){
                        await updateHealth(userHP, currentDate);
                    }
                    if(isEnemy != currentEnemy){
                        console.log('jest przeciwnik')
                        setCurrentEnemy(isEnemy);
                    }
                    if(isEncounter != currentEncounter){
                        console.log('jest zdarzenie')
                        setCurrentEncounter(isEncounter);
                    }
                    if(gainedGold > 0){
                        updateGold(gainedGold);
                    }
                    //console.log(userHP, enemy, encounter, gainedGold, gameEventText, encounterLogs);
                } else {
                    if(currentHealth == 0){
                        const event = getEventById(2);
                        gameEvent.title = event.title;
                        gameEvent.text = event.description;
                        gameStarted = false;
                    }
                    if(currentEnergy == 0){
                        const event = getEventById(3);
                        gameEvent.title = event.title;
                        gameEvent.text = event.description;
                        gameStarted = false;
                    }
                    setGameStarted(false);
                }

                const newGameLogs = [gameEvent, ...gameLogs];
                setGameLogs(newGameLogs);
                addGameLogsToStorage(gameStarted, currentDate, currentHealth, newGameLogs, lastEnemy, lastEncounter);

            }, newEventRate)
        }

        return () => clearInterval(intervalId);
    }, [gameStarted, currentEnemy, currentEncounter, gameLogs]);

    const startGame = async() => {
        const currentDate = new Date;
        const dateString = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        const event = getEventById(1);
        const gameStartEvent = {
            date: currentDate.toISOString(),
            title: event.title,
            text: event.description,
            encounterLogs: []
        }
        const gameStarted = true;
        const startingGameLogs = [gameStartEvent];
        setGameLogs(startingGameLogs);

        await addGameLogsToStorage(gameStarted, currentDate, currentHealth, startingGameLogs);

    }

    //URUCHAMIANIE I ZATRZYMYWANIE GRY
    const gameStartStop = () => {
        //console.log('asdfsafsaf', gameStarted);
        if(!gameStarted){
            startGame();
        } else {
            setCurrentEncounter(null);
            setCurrentEnemy(null);
            const currentDate = new Date();

            addGameLogsToStorage(false, currentDate, currentHealth, gameLogs);
        }

        setGameStarted(!gameStarted);
    }

    //POBIERANIE DANYCH O ZDARZENIU
    const getEventById = (eventId) => {
        const event = gameEvents.find((e) => e.id === eventId);
        if (event) {
            return event
        } else {
            return 'Nie znaleziono wydarzenia o podanym ID.';
        }
    }
    

    //FUNKCJA LOSUJĄCA LICZBĘ Z PRZEDZIAŁU
    //const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


    const memoizedValues = useMemo(() => {
        return {
            gameStartStop
        }
    }, [gameStarted]);

    return (
        <GameLogicContext.Provider
            value={memoizedValues}
        >
            {children}

        </GameLogicContext.Provider>
    )
}
