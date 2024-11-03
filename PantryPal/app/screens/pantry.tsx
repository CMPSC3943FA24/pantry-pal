import React, { useState, useEffect, useMemo } from "react";
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
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  getCategoryNameById,
  filterPantryItems,
  handleSearch,
  countByLocation,
  resetFormFields,
} from "../utils";

// Data structures to represent pantry items and categories
interface PantryItem {
  id: number;
  name: string;
  category_id: number;
  expiration_date: string;
  quantity: number;
  notes: string;
}

interface Category {
  id: number;
  name: string;
}

// Helper function to get the first value from params, handling both arrays and single strings
const getSingleValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value || "";
};

export default function PantryScreen() {
  const params = useLocalSearchParams(); // Retrieve navigation parameters for autofill
  const [addModalVisible, setAddModalVisible] = useState(false); // Control state for add modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Control state for delete modal visibility
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]); // Stores pantry items
  const [categories, setCategories] = useState<Category[]>([]); // Stores item categories
  const [locations, setLocations] = useState<Location[]>([]); // Stores item locations
  const [location, setLocation] = useState<number | null>(null); // Track selected location

  // Form fields for item addition
  const [itemName, setItemName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [expirationDate, setExpirationDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [itemId, setItemId] = useState<number | null>(null); // Track ID of item to delete
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null); // Category filter
  const [filterLocationId, setFilterLocationId] = useState<number | null>(null); // Location filter

  // Initialize database and fetch initial data on component mount
  useEffect(() => {
    const initializeData = async () => {
      console.log("Component mounted: initializing data");
      initializeDatabase();
      await fetchCategories();
      await fetchLocations();
      await fetchPantryItems();
    };
    initializeData();
  }, []);

  // Handle incoming params to auto-populate fields if available, then reset params
  useEffect(() => {
    if (
      (params?.itemName || params?.expirationDate || params?.notes) &&
      !addModalVisible
    ) {
      console.log("Processing params for modal");
      setItemName(getSingleValue(params?.itemName));
      setExpirationDate(getSingleValue(params?.expirationDate));
      setNotes(getSingleValue(params?.notes));

      setAddModalVisible(true);
      router.replace("./pantry"); // Clear params by reloading the screen without them
    }
  }, [params]);

  // Fetch updated pantry items whenever the screen regains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPantryItems();
    }, [])
  );

  // Retrieve pantry items from database
  const fetchPantryItems = async () => {
    const fetchedPantryItems = getPantryItems();
    console.log("Fetched pantry items:", fetchedPantryItems.length);
    setPantryItems(fetchedPantryItems);
  };

  // Retrieve categories from database
  const fetchCategories = async () => {
    const fetchedCategories = getCategories();
    console.log("Categories fetched:", fetchedCategories);
    setCategories(fetchedCategories);
  };

  // Retrieve item locations from database
  const fetchLocations = async () => {
    const fetchedLocations = getLocations();
    console.log("Locations fetched:", fetchedLocations);
    setLocations(fetchedLocations);
  };

  // Memoized map for quick category name lookup
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  // Date picker visibility handlers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle date selection in date picker
  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setExpirationDate(formattedDate);
    hideDatePicker();
  };

  // Close add modal and reset form fields
  const closeAddModal = () => {
    console.log("Closing add modal");
    setAddModalVisible(false);
    resetFormFields(
      setItemName,
      setLocation,
      setSelectedCategoryId,
      setExpirationDate,
      setQuantity,
      setNotes
    );
  };

  // Close delete modal and reset selected item
  const closeDeleteModal = () => {
    console.log("Closing delete modal");
    setDeleteModalVisible(false);
    setItemId(null);
  };

  // Validate and add a new item to the pantry
  const handleAddItem = async () => {
    if (
      !selectedCategoryId ||
      !itemName ||
      !expirationDate ||
      quantity <= 0 ||
      location === null
    ) {
      console.error("Required fields are missing or invalid");
      return;
    }

    try {
      console.log("Adding item:", itemName);
      addPantryItem(
        itemName,
        selectedCategoryId,
        0,
        location,
        expirationDate,
        quantity,
        new Date().toISOString(),
        notes
      );
      await fetchPantryItems();
      closeAddModal();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Delete an item from the pantry by ID
  const handleDeleteItem = (id: number) => {
    try {
      deletePantryItem(id);
      setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Confirmation prompt for item deletion
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

  // Filter pantry items based on search query, category, and location
  const filteredItems = filterPantryItems(
    pantryItems,
    searchQuery,
    filterCategoryId,
    filterLocationId
  );

  // Determine header title based on selected location filter
  const getHeaderTitle = () => {
    if (filterLocationId === 1) return "Your Fridge Items";
    if (filterLocationId === 2) return "Your Freezer Items";
    if (filterLocationId === 3) return "Your Pantry Items";
    return "Your Items";
  };

  // Render a single pantry item, including category details
  const renderPantryItem = ({
    item,
    index,
  }: {
    item: PantryItem;
    index: number;
  }) => {
    const categoryName = getCategoryNameById(item.category_id, categoryMap);

    return (
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
            params: { item: JSON.stringify(item) },
          }}
          style={styles.itemContentWrapper}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Category: {categoryName}</Text>
            <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with search and filter options */}
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
            onPress={() => setFilterLocationId(1)}
          >
            <Text style={styles.filterText}>
              Fridge ({countByLocation(pantryItems, 1)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.freezerButton]}
            onPress={() => setFilterLocationId(2)}
          >
            <Text style={styles.filterText}>
              Freezer ({countByLocation(pantryItems, 2)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.pantryButton]}
            onPress={() => setFilterLocationId(3)}
          >
            <Text style={styles.filterText}>
              Pantry ({countByLocation(pantryItems, 3)})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.clearButton]}
            onPress={() => {
              setFilterCategoryId(null);
              setFilterLocationId(null);
            }}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Display header title and filtered pantry items */}
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

      {/* Floating buttons to open modals for adding or deleting items */}
      <TouchableOpacity
        style={styles.floatingButtonAdd}
        onPress={() => setAddModalVisible(true)}
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
        visible={addModalVisible}
        onRequestClose={closeAddModal}
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
            />
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.datePickerButton}>Select Date</Text>
            </TouchableOpacity>
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
                onPress={closeAddModal}
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
        onRequestClose={closeDeleteModal}
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
                onPress={closeDeleteModal}
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
