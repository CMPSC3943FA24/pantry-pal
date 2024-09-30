import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, SafeAreaView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { initializeDatabase, getCategories, getPantryItems, addPantryItem } from './databaseService';  // Import from the databaseService
import { Picker } from '@react-native-picker/picker';  // Import the Picker component

// Define the type for the PantryItem and Category
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

interface Category {
  id: number;
  name: string;
}

export default function App() {
  // State to manage pantry items and categories
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // States for form inputs
  const [itemName, setItemName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Initialize the database when the app starts
    initializeDatabase();

    // Fetch pantry items and categories from the database
    fetchPantryItems();
    fetchCategories();
  }, []);

  // Function to fetch all pantry items from the database
  const fetchPantryItems = () => {
    const fetchedPantryItems = getPantryItems();
    setPantryItems(fetchedPantryItems);  // Update state with fetched pantry items
  };

  // Function to fetch all categories from the Categories table
  const fetchCategories = () => {
    const fetchedCategories = getCategories();
    setCategories(fetchedCategories);  // Update state with fetched categories
  };

  // Function to add a new item to the pantry
  const handleAddItem = () => {
    if (selectedCategoryId === null || !itemName || !expirationDate || quantity <= 0) {
      console.error('Required fields are missing or invalid');
      return;
    }

    try {
      // Call addPantryItem from databaseService
      addPantryItem(
        itemName,
        selectedCategoryId,   // Category ID from Picker
        0,  // Assuming the brand is not linked to the Brands table
        0,  // Assuming the location is not linked to the Locations table
        expirationDate,
        quantity,
        new Date().toISOString(),  // Current date as added_date
        notes
      );
      console.log('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
    }

    // Refresh the pantry items list after adding the new item
    fetchPantryItems();

    // Close the modal
    setModalVisible(false);

    // Clear the form
    setItemName('');
    setSelectedCategoryId(null);
    setBrand('');
    setLocation('');
    setExpirationDate('');
    setQuantity(0);
    setNotes('');
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
      <Button title="Add Item" onPress={() => setModalVisible(true)} />
      
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

      {/* Modal for adding a new pantry item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Pantry Item</Text>
            
            {/* Item Name Input */}
            <Text>Item Name</Text>
            <TextInput
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            {/* Category Picker */}
            <Text>Category</Text>
            <Picker
              selectedValue={selectedCategoryId}
              onValueChange={(itemValue: React.SetStateAction<number | null>) => setSelectedCategoryId(itemValue)}
              style={{ height: 50, marginBottom: 10 }}
            >
              <Picker.Item label="Select a Category" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>

            {/* Brand Input */}
            <Text>Brand</Text>
            <TextInput
              placeholder="Brand"
              value={brand}
              onChangeText={setBrand}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            {/* Location Input */}
            <Text>Location</Text>
            <TextInput
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            {/* Expiration Date Input */}
            <Text>Expiration Date</Text>
            <TextInput
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={expirationDate}
              onChangeText={setExpirationDate}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            {/* Quantity Input */}
            <Text>Quantity</Text>
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(value) => setQuantity(Number(value))}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            {/* Notes Input */}
            <Text>Notes</Text>
            <TextInput
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />
            
            {/* Save and Cancel Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={handleAddItem} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
