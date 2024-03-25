
const gameEvents = [
    {
        id: 1,
        category: 'Information',
        title: 'Start of the Journey',
        description: "Adventure Start. Come back later to see how is the journey going",
    },
    {
        id: 2,
        category: 'Information',
        title: 'Wounded',
        description: "You're wounded, you go back to base",
    },
    {
        id: 3,
        category: 'Information',
        title: 'Exhausted',
        description: "You're tired, you go back to base"
    },




    {
        id: 4,
        category: 'Enemy',
        title: 'Battle Against Slime',
        enemy:{
            name: 'Slime',
            hp: 12,
            gold: [2, 6],
            dmg: [6,12],
            
        } 
    },
    {
        id: 5,
        category: 'Enemy',
        title: 'Battle Against Imp',
        enemy:{
            name: 'Imp',
            hp: 18,
            gold: [4, 10],
            dmg: [7,12],
            
        } 
    },
    {
        id: 6,
        category: 'Enemy',
        title: 'Battle Against Skeleton',
        enemy:{
            name: 'Skeleton',
            hp: 15,
            gold: [8, 18],
            dmg: [8,20],
            
        } 
    },
    {
        id: 7,
        category: 'Enemy',
        title: 'Battle Against Zombie',
        enemy:{
            name: 'Zombie',
            hp: 20,
            gold: [10, 20],
            dmg: [5,10],
            
        } 
    },



    {
        id: 8,
        category: 'Encounter',
        title: 'Suspicious Chest',
        description: "There's a chest in front of you. You kneel and try to open it...",
        attribute: 'perception',
        difficulty: [4,8],
        outcomes:{
            success: {
                description: "Before opening it, you noticed that it was a trap. You managed to disarm it and open the chest!",
                gold: [20,100],
            },
            fail: {
                description: "It was a trap! The chest will explode!",
                dmg: [10,50]
            }
        }
    },
    {
        id: 9,
        category: 'Encounter',
        title: 'The Forgotten Path',
        description: "While exploring the ancient ruins, you notice a barely visible path leading to an overgrown entrance.",
        attribute: 'perception',
        difficulty: [3,6],
        outcomes:{
            success: {
                description: "Your keen eye allows you to find the treasure hidden behind the mysterious door!",
                gold: [30,80],
            },
            fail: {
                description: "Despite your best efforts, you cannot find the mechanism that opens the secret passage.",

            }
        }
    },




    {
        id: 10,
        category: 'Encounter',
        title: 'Mysterious Runes',
        description: "You encounter a wall marked with mysterious runes.",
        attribute: 'wisdom',
        difficulty: [5,10],
        outcomes:{
            success: {
                description: "You manage to recognize the language in which they are written. You say the spell written on the wall and a secret passage with a magical hiding place opens in front of you!",
                gold: [10,70],
            },
            fail: {
                description: "You don't understand any of this. You move on.",

            }
        }
    },
    {
        id: 11,
        category: 'Encounter',
        title: 'Altar of the Magi',
        description: "Wandering through an ancient forest, you come across a stone altar hidden among the trees, on which rests a book surrounded by a delicate glow.",
        attribute: 'wisdom',
        difficulty: [3,8],
        outcomes:{
            success: {
                description: "By immersing yourself in the texts of the book, you find prayers and healing spells. Understanding and applying them allows you to immediately heal your wounds!",
                hp: [400,400],
            },
            fail: {
                description: "The texts are complicated and require deeper knowledge. Despite your sincere efforts, you fail to fully understand the ancient spells. However, just being at the altar brings relief and little healing.",
                hp: [10,20]
            }
        }
    },







    {
        id: 12,
        category: 'Encounter',
        title: 'Friendly Wizard',
        description: "You encounter a wizard magician who invites you to sit by the fire. After some time, he instructs you to close your eyes, focusing on the flames and repeating his incantations...",
        attribute: 'concentration',
        difficulty: [3,6],
        outcomes:{
            success: {
                description: "You feel a soothing warmth enveloping your body. Wounds heal, and you rise, rejuvenated and ready for new adventures!",
                hp: [10,20]
            },
            fail: {
                description: "Unable to maintain focus, the magical energies waver. The wizard thanks you for your attempt, tossing a single gold coin your way as a gesture of appreciation.",
                gold: [1,1]
            }
        }
    },
    {
        id: 13,
        category: 'Encounter',
        title: 'Bridge of Hesitation',
        description: "While traversing a foggy valley, you come across an old suspended bridge. His boards seem unstable, and each step must be carefully considered. The wind rocks the structure, requiring concentration to safely reach the other side.",
        attribute: 'concentration',
        difficulty: [4,9],
        outcomes:{
            success: {
                description: "By focusing on each step and ignoring distractions, you manage to cross the bridge safely!",
            },
            fail: {
                description: "Losing your concentration, you step on a wobbly board that breaks under your weight. A fall results in painful injuries and the need to find an alternative route.",
                dmg:[20,40]
            }
        }
    },



    {
        id: 14,
        category: 'Encounter',
        title: 'Sudden Attack',
        description: "While traveling through a dark forest, you suddenly hear the rustle of leaves behind you. Before you can react, you are attacked!",
        attribute: 'reflex',
        difficulty: [4,10],
        outcomes:{
            success: {
                description: "Your quick reflexes allow you to avoid the attack and your opponent ends up in a trap he himself set. You find a bag of gold with him!",
                gold: [5,20]
            },
            fail: {
                description: "You didn't react fast enough. The attack surprises you, dealing damage.",
                dmg: [5,15]
            }
        }
    },
    {
        id: 15,
        category: 'Encounter',
        title: 'Very Old Bridge',
        description: "As you cross the old wooden bridge, the boards begin to crack under your feet. You need to decide quickly what you're doing!",
        attribute: 'reflex',
        difficulty: [3,7],
        outcomes:{
            success: {
                description: "Thanks to your quick reaction, you manage to jump to a more stable part of the bridge, avoiding falling into the raging river below!",
            },
            fail: {
                description: "Your attempts to keep your balance fail and you fall into the cold water below.",
                dmg: [5,12]
            }
        }
    },
]

export default gameEvents;