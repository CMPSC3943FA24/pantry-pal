import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, SafeAreaView } from 'react-native';
import { initializeDatabase } from './databaseService';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pantryDB.db');

// Define the type for the PantryItem
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

export default function App() {

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  useEffect(() => {
    // Initialize the database when the app starts
    initializeDatabase();

    // Fetch pantry items from the database
    fetchPantryItems();
  }, []);

  // Function to fetch all pantry items from the database
  const fetchPantryItems = async () => {
    const statement = await db.prepareAsync('SELECT * FROM PantryItems;');
    const result = await statement.executeAsync<PantryItem>();
    const fetchedPantryItems: PantryItem[] = [];

    // Iterate through the results and add each pantry item to the array
    for await (const row of result) {
      fetchedPantryItems.push(row as PantryItem);
    }
    await statement.finalizeAsync(); // Finalize the statement

    setPantryItems(fetchedPantryItems); // Update state with fetched pantry items
  };

  // UI for displaying the pantry items
  const renderPantryItem = ({ item }: { item: PantryItem }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name} (Quantity: {item.quantity})</Text>
      <Text>Expiration Date: {item.expiration_date}</Text>
      <Text>Notes: {item.notes}</Text>
    </View>
  );



  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Pantry Items</Text>
      <Button title="Refresh Pantry Items" onPress={fetchPantryItems} />
      
      {/* Check if there are any pantry items */}
      {pantryItems.length === 0 ? (
        <Text>No items in pantry</Text> // Display message if there are no items
      ) : (
        <FlatList
          data={pantryItems}
          renderItem={renderPantryItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
}
