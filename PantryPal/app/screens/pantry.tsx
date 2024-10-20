import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  initializeDatabase,
  getCategories,
  getPantryItems,
  addPantryItem,
  getLocations,
  Location,
  deletePantryItem,
} from "../databaseService";
import { styles } from "../styles";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  getCategoryNameById,
  filterPantryItems,
  handleSearch,
  countByCategory,
  resetFormFields,
} from "../utils";

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

// Helper function to ensure that parameters are handled as strings
const getSingleValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0]; // If it's an array, take the first element
  }
  return value || ""; // If it's a string, return the string; otherwise, return an empty string
};

export default function PantryScreen() {
  const params = useLocalSearchParams();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // Ensure the values are strings using the helper function
  const [itemName, setItemName] = useState(getSingleValue(params?.itemName));
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [expirationDate, setExpirationDate] = useState(getSingleValue(params?.expirationDate));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState(getSingleValue(params?.notes));
  const [itemId, setItemId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);

  // Flag to track if modal should be opened after data is set
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await initializeDatabase();
      await fetchPantryItems();
      await fetchCategories();
      await fetchLocations();

      // Check if there's prefilled data, and set the modal open flag
      if (itemName || expirationDate || notes) {
        setShouldOpenModal(true); // Mark that the modal should open
      }
    };
    initializeData();
  }, []); // Run on component mount

  // Effect to open modal if prefilled data is present
  useEffect(() => {
    if (shouldOpenModal) {
      setModalVisible(true); // Open the modal once all data has been fetched
      setShouldOpenModal(false); // Reset the flag
    }
  }, [shouldOpenModal]); // This effect will run when the flag changes

  useFocusEffect(
    React.useCallback(() => {
      fetchPantryItems();
    }, [])
  );

  const fetchPantryItems = async () => {
    const fetchedPantryItems = await getPantryItems();
    setPantryItems(fetchedPantryItems);
  };

  const fetchCategories = async () => {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  };

  const fetchLocations = async () => {
    const fetchedLocations = await getLocations();
    setLocations(fetchedLocations);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setExpirationDate(formattedDate);
    hideDatePicker();
  };

  const handleAddItem = async () => {
    if (
      selectedCategoryId === null ||
      location === null ||
      !itemName ||
      !expirationDate ||
      quantity <= 0
    ) {
      console.error("Required fields are missing or invalid");
      return;
    }

    try {
      await addPantryItem(
        itemName,
        location,
        0,
        0,
        expirationDate,
        quantity,
        new Date().toISOString(),
        notes
      );
      await fetchPantryItems();
      setModalVisible(false);
      resetFormFields(
        setItemName,
        setLocation,
        setSelectedCategoryId,
        setExpirationDate,
        setQuantity,
        setNotes
      );
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = (id: number) => {
    try {
      deletePantryItem(id);
      setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setDeleteModalVisible(false);
      setItemId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const confirmDeleteItem = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteItem(id),
        },
      ],
      { cancelable: true }
    );
  };

  const filteredItems = filterPantryItems(
    pantryItems,
    searchQuery,
    filterCategoryId
  );

  const getHeaderTitle = () => {
    if (filterCategoryId === 1) {
      return "Your Fridge Items";
    } else if (filterCategoryId === 2) {
      return "Your Freezer Items";
    } else if (filterCategoryId === 3) {
      return "Your Pantry Items";
    } else {
      return "Your Items"; // Default when no filter is applied
    }
  };

  const renderPantryItem = ({
    item,
    index,
  }: {
    item: PantryItem;
    index: number;
  }) => (
    <View
      style={[
        styles.itemContainer,
        index % 2 === 0
          ? styles.itemBackgroundLight
          : styles.itemBackgroundDark,
      ]}
    >
      <Link
        href={{
          pathname: "./itemDetail",
          params: {
            item: JSON.stringify(item),
          },
        }}
        style={styles.itemContentWrapper}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            Category: {getCategoryNameById(item.category_id, categories)}
          </Text>
          <Text style={styles.itemDetails}>
            Quantity: {item.quantity.toString()}
          </Text>
          {item.expiration_date ? (
            <Text style={styles.itemDetails}>
              Expires on: {item.expiration_date}
            </Text>
          ) : (
            <Text style={styles.itemDetails}>No expiration date</Text>
          )}
        </View>
      </Link>

      <TouchableOpacity
        onPress={() => confirmDeleteItem(item.id)}
        style={styles.trashIcon}
      >
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.itemsHeader}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Items"
          value={searchQuery}
          onChangeText={(query) => handleSearch(query, setSearchQuery)}
        />
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, styles.fridgeButton]}
            onPress={() => setFilterCategoryId(1)}
          >
            <Text style={styles.filterText}>
              Fridge ({countByCategory(pantryItems, 1)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.freezerButton]}
            onPress={() => setFilterCategoryId(2)}
          >
            <Text style={styles.filterText}>
              Freezer ({countByCategory(pantryItems, 2)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.pantryButton]}
            onPress={() => setFilterCategoryId(3)}
          >
            <Text style={styles.filterText}>
              Pantry ({countByCategory(pantryItems, 3)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.clearButton]}
            onPress={() => setFilterCategoryId(null)}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.itemsHeader}>{getHeaderTitle()}</Text>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items in pantry</Text>
        ) : (
          filteredItems.map((item, index) => (
            <View key={item.id}>{renderPantryItem({ item, index })}</View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButtonAdd}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.floatingButtonDelete}
        onPress={() => setDeleteModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>-</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Pantry Item</Text>
            <TextInput
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />
            <Text>Category</Text>
            <Picker
              selectedValue={selectedCategoryId}
              onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Category" value={null} />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
            <Text>Location</Text>
            <Picker
              selectedValue={location}
              onValueChange={(itemValue) => setLocation(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Location" value={null} />
              {locations.map((loc) => (
                <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
              ))}
            </Picker>
            <TextInput
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={expirationDate}
              onChangeText={setExpirationDate}
              style={styles.input}
              onFocus={showDatePicker}
            />
            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(quantity - 1, 0))}
                style={styles.button}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(value) => setQuantity(parseInt(value, 10))}
              />
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddItem}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Select an item to delete:</Text>
            <Picker
              selectedValue={itemId}
              onValueChange={(value) => setItemId(value)}
            >
              <Picker.Item label="Select an Item" value={null} />
              {pantryItems.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => itemId !== null && handleDeleteItem(itemId)}
                style={styles.saveButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
