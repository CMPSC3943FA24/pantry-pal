import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { initializeDatabase, getCategories, getPantryItems, addPantryItem, getLocations, Location, deletePantryItem } from './databaseService'; // Import Location from databaseService
import { styles } from './styles';

// Define the type for PantryItem
interface PantryItem {
  id: number;
  name: string;
  category_id: number;
  expiration_date: string;
  quantity: number;
  notes: string;
}

// Define the type for Category
interface Category {
  id: number;
  name: string;
}

export default function App() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Added delete modal visibility state
  const [itemName, setItemName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [location, setLocation] = useState<number | null>(null);
  const [expirationDate, setExpirationDate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');
  const [itemId, setItemId] = useState<number | null>(null); // Added state for selected item to delete


  // useEffect to initialize the database and fetch items/categories on component mount
  useEffect(() => {
    initializeDatabase();  // Initialize database when app starts
    fetchPantryItems();  // Fetch pantry items from the database
    fetchCategories();  // Fetch categories from the database
    fetchLocations(); // Fetch locations from the database
  }, []);

  // Function to fetch all pantry items from the database
  const fetchPantryItems = () => {
    const fetchedPantryItems = getPantryItems();
    setPantryItems(fetchedPantryItems); // Update state with fetched pantry items
  };

  // Function to fetch all categories from the Categories table
  const fetchCategories = () => {
    const fetchedCategories = getCategories();
    setCategories(fetchedCategories); // Update state with fetched categories
  };

  // Fetch locations from the Locations table
  const fetchLocations = () => {
    const fetchedLocations = getLocations();
    setLocations(fetchedLocations);
  };

  const handleAddItem = () => {
    if (selectedCategoryId === null || location === null || !itemName || !expirationDate || quantity <= 0) {
      console.error('Required fields are missing or invalid');
      return;
    }

    try {
      addPantryItem(itemName, location, 0, 0, expirationDate, quantity, new Date().toISOString(), notes);
      console.log('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
    }

    fetchPantryItems();
    setModalVisible(false);
    resetFormFields();
  };

  const handleDeleteItem = (id: number) => {
    try {
      deletePantryItem(id);
      console.log('Item deleted successfully');
      setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setDeleteModalVisible(false);
      setItemId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const confirmDeleteItem = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteItem(id) },
      ],
      { cancelable: true }
    );
  };

  const resetFormFields = () => {
    setItemName('');
    setLocation(null);
    setSelectedCategoryId(null);
    setExpirationDate('');
    setQuantity(0);
    setNotes('');
  };

  // Function to count how many items exist in each category (Fridge, Freezer, Pantry)
  const countByCategory = (categoryId: number) => pantryItems.filter(item => item.category_id === categoryId).length;

  // Function to render a single pantry item in the list
  const renderPantryItem = ({ item }: { item: PantryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>Expires in {item.expiration_date}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
      </View>
      <Text style={[styles.badge, item.category_id === 1 ? styles.fridgeBadge : item.category_id === 2 ? styles.freezerBadge : styles.pantryBadge]}>
        {item.category_id === 1 ? 'Fridge' : item.category_id === 2 ? 'Freezer' : 'Pantry'}
      </Text>
      {/* Delete button that shows a confirmation prompt */}
      <TouchableOpacity onPress={() => confirmDeleteItem(item.id)}>
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Items"
        />
        <View style={styles.filterButtons}>
          {/* Button to filter items by Fridge */}
          <TouchableOpacity style={[styles.filterButton, styles.fridgeButton]}>
            <Text style={styles.filterText}>Fridge ({countByCategory(1)})</Text>
          </TouchableOpacity>

          {/* Button to filter items by Freezer */}
          <TouchableOpacity style={[styles.filterButton, styles.freezerButton]}>
            <Text style={styles.filterText}>Freezer ({countByCategory(2)})</Text>
          </TouchableOpacity>

          {/* Button to filter items by Pantry */}
          <TouchableOpacity style={[styles.filterButton, styles.pantryButton]}>
            <Text style={styles.filterText}>Pantry ({countByCategory(3)})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button to add a new item */}
      <Button title="Add Item" onPress={() => setModalVisible(true)} />
      
      {/* Button to delete an item */}
      <Button title="Delete Item" onPress={() => setDeleteModalVisible(true)} />

      {/* List of recent items */}
      <ScrollView contentContainerStyle={styles.recentItemsContainer}>
        <Text style={styles.recentItemsHeader}>Your Recent Items</Text>
        {pantryItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items in pantry</Text>
        ) : (
          pantryItems.map((item) => (
            // Ensure a unique key is provided for each item
            <View key={item.id}>
              {renderPantryItem({ item })}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal for adding items */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Pantry Item</Text>

            {/* Item Name Input */}
            <Text>Item Name</Text>
            <TextInput
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />

            {/* Category Picker */}
            <Text>Category</Text>
            <Picker
              selectedValue={selectedCategoryId}
              onValueChange={(itemValue: React.SetStateAction<number | null>) => setSelectedCategoryId(itemValue)}
              style={{ height: 150, marginBottom: 10  }}
            >
              <Picker.Item label="Select a Category" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>

            {/* Location Picker */}
            <Text>Location</Text>
            <Picker
              selectedValue={location}
              onValueChange={(itemValue: React.SetStateAction<number | null>) => setLocation(itemValue)}
              style={{ height: 150, marginBottom: 10 }}
            >
              <Picker.Item label="Select a Location" value={null} />
              {locations.map((loc) => (
                <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
              ))}
            </Picker>

            {/* Expiration Date Input */}
            <Text>Expiration Date</Text>
            <TextInput
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={expirationDate}
              onChangeText={setExpirationDate}
              style={styles.input}
            />

            {/* Quantity Input */}
            <Text>Quantity</Text>
            <View style={styles.quantityContainer}>
              
              {/* Decrease Button */}
              <TouchableOpacity onPress={() => setQuantity((prev) => Math.max(prev - 1, 0))} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>

              {/* Display Current Quantity */}
              <Text style={styles.quantityText}>{quantity}</Text>

              {/* Increase Button */}
              <TouchableOpacity onPress={() => setQuantity((prev) => prev + 1)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Notes Input */}
            <Text>Notes</Text>
            <TextInput
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
            />

            {/* Save and Cancel Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleAddItem} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for deleting an item via Picker */}
      <Modal animationType="slide" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Pantry Item</Text>
            <Text>Select an item to delete:</Text>
            <Picker selectedValue={itemId} onValueChange={(value) => setItemId(value)}>
              <Picker.Item label="Select an Item" value={null} />
              {pantryItems.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => itemId !== null && handleDeleteItem(itemId)} style={styles.saveButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
}