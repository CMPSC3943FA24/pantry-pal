import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
import { initializeDatabase, getCategories, getPantryItems, addPantryItem, getLocations, Location, deletePantryItem } from './databaseService'; // Import your databaseService
import { styles } from './styles';
import ItemDetail from './itemDetail';  // Import the new item detail screen

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

// Create the stack navigator
const Stack = createStackNavigator();

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
  const [searchQuery, setSearchQuery] = useState<string>(''); // For search
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null); // For category filtering

  useEffect(() => {
    initializeDatabase();  // Initialize database when app starts
    fetchPantryItems();  // Fetch pantry items from the database
    fetchCategories();  // Fetch categories from the database
    fetchLocations(); // Fetch locations from the database
  }, []);

  const fetchPantryItems = () => {
    const fetchedPantryItems = getPantryItems();
    setPantryItems(fetchedPantryItems);
  };

  const fetchCategories = () => {
    const fetchedCategories = getCategories();
    setCategories(fetchedCategories);
  };

  const fetchLocations = () => {
    const fetchedLocations = getLocations();
    setLocations(fetchedLocations);
  };

  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredPantryItems = pantryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategoryId ? item.category_id === filterCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const handleFilterByCategory = (categoryId: number | null) => {
    setFilterCategoryId(categoryId);
  };

  // Add the dynamic header based on the filter
  const getHeaderTitle = () => {
    if (filterCategoryId === 1) {
      return 'Your Fridge Items';
    } else if (filterCategoryId === 2) {
      return 'Your Freezer Items';
    } else if (filterCategoryId === 3) {
      return 'Your Pantry Items';
    } else {
      return 'Your Items'; // Default when no filter is applied
    }
  };

  const handleAddItem = () => {
    if (selectedCategoryId === null || location === null || !itemName || !expirationDate || quantity <= 0) {
      console.error('Required fields are missing or invalid');
      return;
    }

    try {
      addPantryItem(itemName, location, 0, 0, expirationDate, quantity, new Date().toISOString(), notes);
      fetchPantryItems();
      setModalVisible(false);
      resetFormFields();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = (id: number) => {
    try {
      deletePantryItem(id);
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

  const countByCategory = (categoryId: number) => pantryItems.filter(item => item.category_id === categoryId).length;

  const renderPantryItem = ({ item, index }: { item: PantryItem; index: number }, navigation: any) => (
    <View style={[styles.itemContainer, index % 2 === 0 ? styles.itemBackgroundLight : styles.itemBackgroundDark]}>
      {/* Wrap content in TouchableOpacity for navigation */}
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetail', { item })} style={styles.itemContentWrapper}>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>Category: {getCategoryNameById(item.category_id)}</Text>
          <Text style={styles.itemDetails}>Quantity: {item.quantity.toString()}</Text>
          {item.expiration_date ? (
            <Text style={styles.itemDetails}>Expires on: {item.expiration_date}</Text>
          ) : (
            <Text style={styles.itemDetails}>No expiration date</Text>
          )}
        </View>
      </TouchableOpacity>
      {/* Trash Can Icon for Delete */}
      <TouchableOpacity onPress={() => confirmDeleteItem(item.id)} style={styles.trashIcon}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );


  const PantryListScreen = ({ navigation }: { navigation: any }) => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Items"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity style={[styles.filterButton, styles.fridgeButton]} onPress={() => handleFilterByCategory(1)}>
            <Text style={styles.filterText}>Fridge ({countByCategory(1)})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.freezerButton]} onPress={() => handleFilterByCategory(2)}>
            <Text style={styles.filterText}>Freezer ({countByCategory(2)})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.pantryButton]} onPress={() => handleFilterByCategory(3)}>
            <Text style={styles.filterText}>Pantry ({countByCategory(3)})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.clearButton]} onPress={() => handleFilterByCategory(null)}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Header */}
      <Text style={styles.itemsHeader}>{getHeaderTitle()}</Text>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredPantryItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items in pantry</Text>
        ) : (
          filteredPantryItems.map((item, index) => (
            <View key={item.id}>
              {renderPantryItem({ item, index }, navigation)}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal for adding items */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Pantry Item</Text>
            <TextInput placeholder="Item Name" value={itemName} onChangeText={setItemName} style={styles.input} />
            <Text>Category</Text>
            <Picker selectedValue={selectedCategoryId} onValueChange={(itemValue) => setSelectedCategoryId(itemValue)} style={styles.picker}>
              <Picker.Item label="Select a Category" value={null} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
            <Text>Location</Text>
            <Picker selectedValue={location} onValueChange={(itemValue) => setLocation(itemValue)} style={styles.picker}>
              <Picker.Item label="Select a Location" value={null} />
              {locations.map((loc) => (
                <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
              ))}
            </Picker>
            <TextInput placeholder="Expiration Date (YYYY-MM-DD)" value={expirationDate} onChangeText={setExpirationDate} style={styles.input} />
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(quantity - 1, 0))} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput style={styles.quantityInput} keyboardType="numeric" value={quantity.toString()} onChangeText={(value) => setQuantity(parseInt(value, 10))} />
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} style={styles.input} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleAddItem} style={styles.saveButton}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Add Item Button */}
      <TouchableOpacity style={styles.floatingButtonAdd} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Floating Delete Item Button */}
      <TouchableOpacity style={styles.floatingButtonDelete} onPress={() => setDeleteModalVisible(true)}>
        <Text style={styles.floatingButtonText}>-</Text>
      </TouchableOpacity>

      {/* Modal for deleting an item */}
      <Modal animationType="slide" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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

  return (
    <Stack.Navigator>
      <Stack.Screen name="PantryList" component={PantryListScreen} options={{ title: 'Pantry' }} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ title: 'Item Details' }} />
    </Stack.Navigator>
  );
}
