import * as SQLite from 'expo-sqlite';

// Open or create the database file 'pantryDB.db' using synchronous API
const db = SQLite.openDatabaseSync('pantryDB.db');

// Predefined data for Categories and Allergens
// These will be inserted into the database if the respective tables are empty
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

// Define types for rows returned by SELECT queries
// CountRow for counting the number of rows in a table
interface CountRow {
    count: number;
}
  
// CategoryRow defines the structure for rows in the Categories table
interface CategoryRow {
    id: number;
    name: string;
}

// Function to initialize the database, create tables, and insert predefined data
export const initializeDatabase = () => {
    let statement;

    try {
        // Create the Categories table if it doesn't exist
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Create the Brands table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Create the Allergens table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Allergens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );`);
        statement.executeSync();

        // Create the PantryItemAllergens table (many-to-many relationship between PantryItems and Allergens)
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS PantryItemAllergens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id INTEGER,
                allergen_id INTEGER,
                FOREIGN KEY(item_id) REFERENCES PantryItems(id),
                FOREIGN KEY(allergen_id) REFERENCES Allergens(id)
            );`);
        statement.executeSync();

        // Create the Locations table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS Locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT
            );`);
        statement.executeSync();

        // Create the PantryItems table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS PantryItems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                category_id INTEGER,
                brand_id INTEGER,
                location_id INTEGER,
                expiration_date DATE,
                quantity INTEGER,
                added_date DATE,
                notes TEXT,
                FOREIGN KEY(category_id) REFERENCES Categories(id),
                FOREIGN KEY(brand_id) REFERENCES Brands(id),
                FOREIGN KEY(location_id) REFERENCES Locations(id)
            );`);
        statement.executeSync();

        // Create the ShoppingList table
        statement = db.prepareSync(`CREATE TABLE IF NOT EXISTS ShoppingList (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_name TEXT,
                quantity INTEGER,
                added_date DATE,
                notes TEXT
            );`);
        statement.executeSync();

        // Check if Categories table is empty, and insert predefined categories if it is
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

        // Check if Allergens table is empty, and insert predefined allergens if it is
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
        // Log any errors that occur during the database initialization
        console.log('Error initializing database:', error);
    } finally {
        // Ensure the prepared statement is finalized (closed)
        if (statement) {
            statement.finalizeSync(); 
        }
    }
};

// CRUD Functions for Categories
// Fetch all categories from the database
export const getCategories = (callback: (categories: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync('SELECT * FROM Categories;');
    });
};

// CRUD Functions for Brands

// Fetch all brands from the database
export const getBrands = (callback: (brands: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync('SELECT * FROM Brands;');
    });
};

// Insert a new brand into the Brands table
export const addBrand = (name: string, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync('INSERT INTO Brands (name) VALUES (?);');
        callback(); // Execute callback after insertion
    });
};

// Update a brand by its ID
export const updateBrand = (id: number, name: string, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync('UPDATE Brands SET name = ? WHERE id = ?;');
        callback(); // Execute callback after update
    });
};

// Delete a brand by its ID
export const deleteBrand = (id: number, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM Brands WHERE id = ?;');
        callback(); // Execute callback after deletion
    });
};

// CRUD Functions for Locations

// Add a new location to the Locations table
export const addLocation = (name: string, callback: () => void) => {
    db.withTransactionSync(() => {
        db.execSync('INSERT INTO Locations (name) VALUES (?);');
        callback(); // Execute callback after insertion
    });
};

// Fetch all locations from the database
export const getLocations = (callback: (locations: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync('SELECT * FROM Locations;');
        (_: any, { rows }: any) => callback(rows._array); // Call callback with results
    });
};

// Update a location by its ID
export const updateLocation = (id: number, name: string) => {
    db.withTransactionSync(() => {
        db.execSync('UPDATE Locations SET name = ? WHERE id = ?;');
    });
};

// Delete a location by its ID
export const deleteLocation = (id: number) => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM Locations WHERE id = ?;');
    });
};

// CRUD Functions for PantryItems

// Insert a new item into the PantryItems table
export const addPantryItem = (name: string, category_id: number, brand_id: number, location_id: number, expiration_date: string, quantity: number, added_date: string, notes: string) => {
    db.withTransactionSync(() => {
        db.execSync(`INSERT INTO PantryItems (name, category_id, brand_id, location_id, expiration_date, quantity, added_date, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`);
    });
};

// Fetch all pantry items from the database
export const getPantryItems = (callback: (pantryItems: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync('SELECT * FROM PantryItems;');
        (_: any, { rows }: any) => callback(rows._array); // Call callback with results
    });
};

// Update an item in the PantryItems table by its ID
export const updatePantryItem = (id: number, name: string, category_id: number, brand_id: number, location_id: number, expiration_date: string, quantity: number, added_date: string, notes: string) => {
    db.withTransactionSync(() => {
        db.execSync(`UPDATE PantryItems SET name = ?, category_id = ?, brand_id = ?, location_id = ?, expiration_date = ?, quantity = ?, added_date = ?, notes = ? 
            WHERE id = ?;`);
    });
};

// Delete a pantry item by its ID
export const deletePantryItem = (id: number) => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM PantryItems WHERE id = ?;');
    });
};

// CRUD Functions for ShoppingList

// Add a new item to the ShoppingList table
export const addShoppingListItem = (item_name: string, quantity: number, added_date: string, notes: string) => {
    db.withTransactionSync(() => {
        db.execSync(`INSERT INTO ShoppingList (item_name, quantity, added_date, notes) 
            VALUES (?, ?, ?, ?);`);
    });
};

// Fetch all shopping list items from the database
export const getShoppingListItems = (callback: (shoppingListItems: any[]) => void) => {
    db.withTransactionSync(() => {
        db.execSync('SELECT * FROM ShoppingList;');
        (_: any, { rows }: any) => callback(rows._array); // Call callback with results
    });
};

// Update a shopping list item by its ID
export const updateShoppingListItem = (id: number, item_name: string, quantity: number, added_date: string, notes: string) => {
    db.withTransactionSync(() => {
        db.execSync(`UPDATE ShoppingList SET item_name = ?, quantity = ?, added_date = ?, notes = ? 
            WHERE id = ?;`);
    });
};

// Delete a shopping list item by its ID
export const deleteShoppingListItem = (id: number) => {
    db.withTransactionSync(() => {
        db.execSync('DELETE FROM ShoppingList WHERE id = ?;');
    });
};
