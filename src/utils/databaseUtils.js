import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import meals from '../constants/mealsDataStructure';
import { nutrients } from '../constants/nutrients';

export const openFoodDatabase = async () => {
    try {
        const sqlDir = FileSystem.documentDirectory + 'SQLite/';
        const internalDbName = 'foodData.db';

        const fileInfo = await FileSystem.getInfoAsync(sqlDir + internalDbName);

        if (!fileInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
            const asset = Asset.fromModule(require('../assets/data/foodData.db'));
            await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
        }

        const db = SQLite.openDatabase(internalDbName);

        //db._db.close();

        // db.transaction(tx => {
        //     tx.executeSql('DROP TABLE meals')
        // });

        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS meals (
                    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date DATE,
                    product_id INTEGER,
                    meal TEXT,
                    amount INTEGER,
                    FOREIGN KEY (product_id) REFERENCES foodData(id))
                    `
            );

            // tx.executeSql(
            //     `CREATE INDEX IF NOT EXISTS idx_meals_date ON meals (date)`
            // );

        },
        error => {
            console.error('Transaction error:', error);
            console.error('Transaction error message:', error.message);
        },
        () => {
            console.log('Transaction completed successfully');
        })

        return db;
    } catch (error) {
        console.error('Error opening database:', error);
    }
}


