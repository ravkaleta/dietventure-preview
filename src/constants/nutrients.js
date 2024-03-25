import { agiIcon, conIcon, perIcon, refIcon, regIcon, strIcon, vitIcon, wisIcon } from "./attributeIcons";

export const nutrients = {
    totalProteins: 0,
    totalFat: 0,
    totalCarbohydrates: 0,
    totalCalories: 0,
    totalCaffeine: 0,
    totalSugar: 0,
    totalFiber: 0,
    totalCalcium: 0,
    totalIron: 0,
    totalMagnesium: 0,
    totalPhosphorus: 0,
    totalPotassium: 0,
    totalSodium: 0,
    totalZinc: 0,
    totalCopper: 0,
    totalSelenium: 0,
    totalVitaminA: 0,
    totalVitaminE: 0,
    totalVitaminD: 0,
    totalVitaminC: 0,
    totalThiamin: 0,
    totalRiboflavin: 0,
    totalNiacin: 0,
    totalVitaminB6: 0,
    totalFolate: 0,
    totalVitaminB12: 0,
    totalCholine: 0,
    totalVitaminK: 0,
    totalCholesterol: 0,
    totalSaturated: 0,
    totalLA: 0,
    totalALA: 0,
    totalDHA: 0,
    totalEPA: 0,
    totalMonoUnsaturated: 0,
    totalPolyUnsaturated: 0,
}

export const dailyNutrientIntake = {
    totalOmega3Intake: 1.6,
    totalOmega6Intake: 17,
    totalCaffeine: 400,
    totalFiber: 25,
    totalCholesterol: 300,

    totalVitaminA: 700,
    totalThiamin: 1.1,    //B1
    totalRiboflavin: 1.1, //B2
    totalNiacin: 15,     //B3
    totalVitaminB6: 1.3,
    totalVitaminB12: 2.4,
    totalVitaminC: 75,
    totalVitaminD: 15,
    totalVitaminE: 8,
    totalVitaminK: 55,
    totalFolate: 400,
    totalCholine: 450,

    totalCalcium: 1000,
    totalIron: 10,
    totalMagnesium: 310,
    totalPhosphorus: 700,
    totalPotassium: 4700,
    totalSodium: 1200,
    totalZinc: 8,
    totalCopper: 0.9,
    totalSelenium: 55,
}

export const startingMacroIntake = {
    dailyCaloricIntake: 2000,
    dailyProteinIntake: [50,100],
    dailyCarbohydratesIntake: [225,350],
    dailySugarIntake: 50,
    dailyFatIntake: [55.6, 66.7],
    dailySaturatedFatIntake: 22,
    dailyMonoUnsaturatedFatIntake: 44,
    dailyPolyUnsaturatedFatIntake: 22,
}

export const omega3Attributes = [[vitIcon, perIcon, wisIcon],[ conIcon, regIcon]];
export const omega6Attributes = [[perIcon]];

export const vitamins = [
    {
        name: 'Vitamin A',
        key: 'totalVitaminA',
        attributes: [[perIcon, regIcon]]
    },
    {
        name: 'Vitamin B1',
        key: 'totalThiamin',
        attributes: [[conIcon]]
    },
    {
        name: 'Vitamin B2',
        key: 'totalRiboflavin',
        attributes: [[perIcon] ]
    },
    {
        name: 'Vitamin B3',
        key: 'totalNiacin',
        attributes: [[vitIcon, refIcon]]
    },
    {
        name: 'Vitamin B4',
        key: 'totalCholine',
        attributes: [[wisIcon, conIcon], [refIcon] ]
    },
    {
        name: 'Vitamin B6',
        key: 'totalVitaminB6',
        attributes: [[vitIcon, refIcon] ]
    },
    {
        name: 'Vitamin B9',
        key: 'totalFolate',
        attributes: [[vitIcon, wisIcon] ]
    },
    {
        name: 'Vitamin B12',
        key: 'totalVitaminB12',
        attributes: [[vitIcon, refIcon] ]
    },
    {
        name: 'Vitamin C',
        key: 'totalVitaminC',
        attributes: [[perIcon, regIcon] ]
    },
    {
        name: 'Vitamin D',
        key: 'totalVitaminD',
        attributes: [[wisIcon, regIcon] ]
    },
    {
        name: 'Vitamin E',
        key: 'totalVitaminE',
        attributes: [[vitIcon, regIcon] ]
    },
    {
        name: 'Vitamin K',
        key: 'totalVitaminK',
        attributes: [[regIcon] ]
    },
];

export const minerals = [
    {
        name: 'Calcium',
        key: 'totalCalcium',
        attributes: [[vitIcon] ]
    },
    {
        name: 'Iron',
        key: 'totalIron',
        attributes: [[vitIcon, conIcon]]
    },
    {
        name: 'Magnesium',
        key: 'totalMagnesium',
        attributes: [[wisIcon, conIcon] ]
    },
    {
        name: 'Phosphorus',
        key: 'totalPhosphorus',
        attributes: [[vitIcon, refIcon] ]
    },
    {
        name: 'Potassium',
        key: 'totalPotassium',
        attributes: [[vitIcon, wisIcon], [conIcon] ]
    },
    {
        name: 'Sodium',
        key: 'totalSodium',
        attributes: [[refIcon] ]
    },
    {
        name: 'Zinc',
        key: 'totalZinc',
        attributes: [[perIcon, wisIcon], [regIcon] ]
    },
    {
        name: 'Copper',
        key: 'totalCopper',
        attributes: [[regIcon] ]
    },
    {
        name: 'Selenium',
        key: 'totalSelenium',
        attributes: [[vitIcon] ]
    }
];