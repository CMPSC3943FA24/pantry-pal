import * as SQLite from "expo-sqlite";

// Open or create the database file 'pantryDB.db' using synchronous API
const db = SQLite.openDatabaseSync("pantryDB.db");

// Predefined data for Categories and Allergens and Locations
const predefinedCategories = [
  "Dairy",
  "Meat & Poultry",
  "Seafood",
  "Produce",
  "Bakery",
  "Canned Goods",
  "Grains & Pasta",
  "Snacks",
  "Frozen Foods",
  "Beverages",
  "Condiments & Sauces",
  "Spices & Herbs",
  "Baking Supplies",
  "Breakfast Items",
  "Health & Supplements",
  "Miscellaneous",
];

const predefinedAllergens = [
  "Gluten",
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Eggs",
  "Soy",
  "Shellfish",
  "Fish",
  "Wheat",
  "Sesame",
  "Mustard",
  "Sulphites",
  "Celery",
  "Lupin",
  "Corn",
  "Artificial Preservatives",
  "Coconut",
];

const predefinedLocations = ["Fridge", "Freezer", "Pantry"];

// Define types for rows returned by SELECT queries
interface CountRow {
  count: number;
}

interface CategoryRow {
  id: number;
  name: string;
}

interface PantryItem {
  id: number;
  name: string;
  category_id: number;
  brand_id: number;
  location_id: number;
  expiration_date: string;
  quantity: number;
  added_date: string;
  notes: string;
}

interface ShoppingList {
  id: number;
  item_name: string;
  quantity: number;
  added_date: string;
  notes: string;
}

// Define and export the Location interface
export interface Location {
  id: number;
  name: string;
}

// Function to initialize the database, create tables, and insert predefined data
export const initializeDatabase = () => {
  try {
    // Create tables
    db.execSync(
      `CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS Brands (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS Allergens (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS PantryItemAllergens (id INTEGER PRIMARY KEY AUTOINCREMENT, item_id INTEGER, allergen_id INTEGER, FOREIGN KEY(item_id) REFERENCES PantryItems(id), FOREIGN KEY(allergen_id) REFERENCES Allergens(id));`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS Locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS PantryItems (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category_id INTEGER, brand_id INTEGER, location_id INTEGER, expiration_date DATE, quantity INTEGER, added_date DATE, notes TEXT, FOREIGN KEY(category_id) REFERENCES Categories(id), FOREIGN KEY(brand_id) REFERENCES Brands(id), FOREIGN KEY(location_id) REFERENCES Locations(id));`
    );
    db.execSync(
      `CREATE TABLE IF NOT EXISTS ShoppingList (id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, quantity INTEGER, added_date DATE, notes TEXT);`
    );

    // Insert predefined Categories if empty
    const categoryCount = db.getAllSync<CountRow>(
      "SELECT COUNT(*) as count FROM Categories;",
      []
    )[0].count;
    if (categoryCount === 0) {
      for (const category of predefinedCategories) {
        db.execSync(`INSERT INTO Categories (name) VALUES ('${category}');`); // Manually interpolate category
      }
    }

    // Insert predefined Allergens if empty
    const allergenCount = db.getAllSync<CountRow>(
      "SELECT COUNT(*) as count FROM Allergens;",
      []
    )[0].count;
    if (allergenCount === 0) {
      for (const allergen of predefinedAllergens) {
        db.execSync(`INSERT INTO Allergens (name) VALUES ('${allergen}');`); // Manually interpolate allergen
      }
    }

    // Insert predefined Locations if empty
    const locationCount = db.getAllSync<CountRow>(
      "SELECT COUNT(*) as count FROM Locations;",
      []
    )[0].count;
    if (locationCount === 0) {
      for (const location of predefinedLocations) {
        db.execSync(`INSERT INTO Locations (name) VALUES ('${location}');`);
      }
    }
  } catch (error) {
    console.log("Error initializing database:", error);
  }
};

// CRUD Functions for Categories
export const getCategories = (): CategoryRow[] => {
  return db.getAllSync<CategoryRow>("SELECT * FROM Categories;", []);
};

// CRUD Functions for Brands
export const getBrands = (): CategoryRow[] => {
  return db.getAllSync<CategoryRow>("SELECT * FROM Brands;", []);
};

export const addBrand = (name: string) => {
  db.execSync(`INSERT INTO Brands (name) VALUES ('${name}');`); // Manually interpolate name
};

export const updateBrand = (id: number, name: string) => {
  db.execSync(`UPDATE Brands SET name = '${name}' WHERE id = ${id};`); // Manually interpolate id and name
};

export const deleteBrand = (id: number) => {
  db.execSync(`DELETE FROM Brands WHERE id = ${id};`); // Manually interpolate id
};

// CRUD Functions for Locations
export const addLocation = (name: string) => {
  db.execSync(`INSERT INTO Locations (name) VALUES ('${name}');`); // Manually interpolate name
};

export const getLocations = (): Location[] => {
  return db.getAllSync<Location>("SELECT * FROM Locations;", []);
};

export const updateLocation = (id: number, name: string) => {
  db.execSync(`UPDATE Locations SET name = '${name}' WHERE id = ${id};`); // Manually interpolate id and name
};

export const deleteLocation = (id: number) => {
  db.execSync(`DELETE FROM Locations WHERE id = ${id};`); // Manually interpolate id
};

// CRUD Functions for PantryItems
export const addPantryItem = (
  name: string,
  category_id: number,
  brand_id: number,
  location_id: number,
  expiration_date: string,
  quantity: number,
  added_date: string,
  notes: string
) => {
  const query = `INSERT INTO PantryItems 
    (name, category_id, brand_id, location_id, expiration_date, quantity, added_date, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.prepareSync(query).executeSync([
    name,
    category_id,
    brand_id,
    location_id,
    expiration_date,
    quantity,
    added_date,
    notes,
  ]);

  console.log("Item added successfully");
};

export const getPantryItems = (): PantryItem[] => {
  return db.getAllSync<PantryItem & { category_name: string }>(
    `SELECT PantryItems.*, Categories.name AS category_name 
         FROM PantryItems 
         INNER JOIN Categories ON PantryItems.category_id = Categories.id;`,
    []
  );
};

export const updatePantryItem = (
  id: number,
  name: string,
  category_id: number,
  brand_id: number,
  location_id: number,
  expiration_date: string,
  quantity: number,
  added_date: string,
  notes: string
) => {
  db.execSync(
    `UPDATE PantryItems SET name = '${name}', category_id = ${category_id}, brand_id = ${brand_id}, location_id = ${location_id}, expiration_date = '${expiration_date}', quantity = ${quantity}, added_date = '${added_date}', notes = '${notes}' 
        WHERE id = ${id};`
  ); // Manually interpolate all values
};

export const deletePantryItem = (id: number) => {
  db.execSync(`DELETE FROM PantryItems WHERE id = ${id};`); // Manually interpolate id
};

// CRUD Functions for ShoppingList
export const addShoppingListItem = (
  item_name: string,
  quantity: number,
  added_date: string,
  notes: string
) => {
  db.execSync(
    `INSERT INTO ShoppingList (item_name, quantity, added_date, notes) 
        VALUES ('${item_name}', ${quantity}, '${added_date}', '${notes}');`
  ); // Manually interpolate all values
};

export const getShoppingListItems = (): ShoppingList[] => {
  return db.getAllSync<ShoppingList>("SELECT * FROM ShoppingList;", []);
};

export const updateShoppingListItem = (
  id: number,
  item_name: string,
  quantity: number,
  added_date: string,
  notes: string
) => {
  db.execSync(
    `UPDATE ShoppingList SET item_name = '${item_name}', quantity = ${quantity}, added_date = '${added_date}', notes = '${notes}' 
        WHERE id = ${id};`
  ); // Manually interpolate all values
};

export const deleteShoppingListItem = (id: number) => {
  db.execSync(`DELETE FROM ShoppingList WHERE id = ${id};`); // Manually interpolate id
};
