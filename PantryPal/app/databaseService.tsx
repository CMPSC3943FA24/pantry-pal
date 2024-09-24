import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pantryDB.db');

// Predefined data for Categories and Allergens
const predefinedCategories = [
    'Dairy', 
    'Meat & Poultry', 
    'Seafood', 
    'Produce', 
    'Bakery', 
    'Canned Goods', 
    'Grains & Pasta', 
    'Snacks', 
    'Frozen Foods', 
    'Beverages', 
    'Condiments & Sauces', 
    'Spices & Herbs', 
    'Baking Supplies', 
    'Breakfast Items', 
    'Health & Supplements', 
    'Miscellaneous', 
];
const predefinedAllergens = [
    'Gluten', 
    'Peanuts', 
    'Tree Nuts', 
    'Dairy', 
    'Eggs', 
    'Soy', 
    'Shellfish', 
    'Fish', 
    'Wheat', 
    'Sesame', 
    'Mustard', 
    'Sulphites', 
    'Celery', 
    'Lupin', 
    'Corn', 
    'Artificial Preservatives', 
    'Coconut',  
];

// Define the shape of rows returned by queries
interface CountRow {
    count: number;
}
  
interface CategoryRow {
    id: number;
    name: string;
}

// Initialize the database
export const initializeDatabase = () => {
    // Create tables with prepared statements
    let statement;

    try {
        // Create Categories table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Create Brands table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Create Allergens table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Allergens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Insert predefined Categories if empty
        statement = db.prepareSync('SELECT COUNT(*) as count FROM Categories;');
        const result = statement.executeSync<CountRow>();
        let count = 0;
        for (const row of result) {
            count = row.count;
        }

        if (count === 0) {
            for (const category of predefinedCategories) {
                statement = db.prepareSync('INSERT INTO Categories (name) VALUES (?);');
                statement.executeSync(category);
            }
        }

        // Insert predefined Allergens if empty
        statement = db.prepareSync('SELECT COUNT(*) as count FROM Allergens;');
        const allergenResult = statement.executeSync<CountRow>();
        let allergenCount = 0;
        for (const row of allergenResult) {
            allergenCount = row.count;
        }

        if (allergenCount === 0) {
            for (const allergen of predefinedAllergens) {
                statement = db.prepareSync('INSERT INTO Allergens (name) VALUES (?);');
                statement.executeSync(allergen);
            }
        }

        } catch (error) {
        console.log('Error initializing database:', error);
        } finally {
        if (statement) {
            statement.finalizeSync(); // Ensure statement is closed
            }
        }
    };


// CRUD Functions
export const getCategories = (callback: (categories: any[]) => void) => {
    (db).withTransactionSync(() => {
        db.execSync(
            'SELECT * FROM Categories;'
        );
    });
}

// Get all Brands
export const getBrands = (callback: (brands: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync(
            'SELECT * FROM Brands;'
        );
    });
};

// Add a new Brand
export const addBrand = (name: string, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync(
            'INSERT INTO Brands (name) VALUES (?);'
        );
        callback();
    });
};

// Update a Brand by ID
export const updateBrand = (id: number, name: string, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync(
            'UPDATE Brands SET name = ? WHERE id = ?;'
        );
        callback();
    });
};

// Delete a Brand by ID
export const deleteBrand = (id: number, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync(
            'DELETE FROM Brands WHERE id = ?;'
        );
        callback();
    });
};