import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, SafeAreaView } from 'react-native';
import { initializeDatabase, getCategories } from './databaseService';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pantryDB.db');

// Define the type for the Category
interface Category {
  id: number;
  name: string;
}

export default function App() {

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Initialize the database when the app starts
    initializeDatabase();

    // Fetch categories from the database
    fetchCategories();
  }, []);

  // Function to fetch all categories from the database
  const fetchCategories = async () => {
    const statement = await db.prepareAsync('SELECT * FROM Categories;');
    const result = await statement.executeAsync<Category>();
    const fetchedCategories: Category[] = [];

    for await (const row of result) {
      fetchedCategories.push(row as Category); // Add each row to the array
    }
    await statement.finalizeAsync(); // Finalize the statement

    setCategories(fetchedCategories); // Update state with fetched categories
  };

  // UI for displaying the categories
  const renderCategory = ({ item }: { item: Category }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name}</Text>
    </View>
  );



  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Categories</Text>
      <Button title="Refresh Categories" onPress={fetchCategories} />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
