import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';  // Import ModalDropdown for dropdown menus
import { initializeDatabase, getCategories, getPantryItems, addPantryItem } from './databaseService'; // Database service functions

// Define the type for PantryItem
interface PantryItem {
  id: number;
  name: string;
  category_id: number;
  expiration_date: string;
  quantity: number;
  notes: string;
}

// Define the type for Category (optional if you're using categories separately)
interface Category {
  id: number;
  name: string;
}

export default function App() {
  // State to manage pantry items
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  // State to manage categories, assuming categories are fetched from the database
  const [categories, setCategories] = useState<Category[]>([]);

  // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // States for form inputs
  const [itemName, setItemName] = useState('');  // Item name input
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);  // Category selected by the user
  const [location, setLocation] = useState<number | null>(null);  // Location: 1 for Fridge, 2 for Freezer, 3 for Pantry
  const [expirationDate, setExpirationDate] = useState('');  // Expiration date input
  const [quantity, setQuantity] = useState(0);  // Quantity of the item
  const [notes, setNotes] = useState('');  // Additional notes input

  // useEffect to initialize the database and fetch items/categories on component mount
  useEffect(() => {
    initializeDatabase();  // Initialize database when app starts
    fetchPantryItems();  // Fetch pantry items from the database
    fetchCategories();  // Fetch categories from the database (optional)
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

  // Function to add a new item to the pantry
  const handleAddItem = () => {
    if (selectedCategoryId === null || location === null || !itemName || !expirationDate || quantity <= 0) {
      console.error('Required fields are missing or invalid');
      return;
    }

    try {
      // Call addPantryItem from databaseService with the necessary parameters
      addPantryItem(itemName, location, 0, 0, expirationDate, quantity, new Date().toISOString(), notes);
      console.log('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
    }

    // Refresh the pantry items list after adding the new item
    fetchPantryItems();

    // Close the modal and reset form fields
    setModalVisible(false);
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

            {/* Category Dropdown */}
            <Text>Category</Text>
            <ModalDropdown
              options={categories.map(category => category.name)}  // Use names from your fetched data
              style={styles.dropdown}
              dropdownStyle={styles.dropdownMenu}
              textStyle={styles.dropdownText}
              onSelect={(index, value) => setSelectedCategoryId(categories[index].id)}  // Set category ID based on selection
              defaultValue="Select a Category"
            />

            {/* Location Dropdown */}
            <Text>Location</Text>
            <ModalDropdown
              options={['Fridge', 'Freezer', 'Pantry']}
              style={styles.dropdown}
              dropdownStyle={styles.dropdownMenu}
              textStyle={styles.dropdownText}
              onSelect={(index, value) => setLocation(index + 1)}
              defaultValue="Select a Location"
            />

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
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(value) => setQuantity(Number(value))}
              style={styles.input}
            />

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
    </SafeAreaView>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  filterText: {
    color: '#000',
  },
  fridgeButton: {
    backgroundColor: '#FFDB5C',
  },
  freezerButton: {
    backgroundColor: '#7AA0FF',
  },
  pantryButton: {
    backgroundColor: '#FF8F8F',
  },
  recentItemsContainer: {
    padding: 20,
  },
  recentItemsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#999',
  },
  itemContainer: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    color: '#555',
  },
  badge: {
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  fridgeBadge: {
    backgroundColor: '#FFDB5C',
  },
  freezerBadge: {
    backgroundColor: '#7AA0FF',
  },
  pantryBadge: {
    backgroundColor: '#FF8F8F',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  dropdown: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  dropdownMenu: {
    width: '85%',
  },
  dropdownText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
