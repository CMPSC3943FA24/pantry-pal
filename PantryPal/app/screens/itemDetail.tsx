import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome for the arrow icon
import { styles } from "../styles";
import { Category, getCategoryNameById } from "../utils"; // Import the utility function
import { getCategories } from "../databaseService"; // Assume categories are coming from here

export default function ItemDetail() {
  const { item } = useLocalSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();

    // Handle the native back button on Android
    const backAction = () => {
      router.push("./pantry"); // Navigate back to the pantry screen
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener when the component unmounts
    return () => backHandler.remove();
  }, []);

  // If no item is found in the parameters
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.itemsHeader}>Item not found</Text>
      </SafeAreaView>
    );
  }

  let parsedItem;
  try {
    parsedItem = JSON.parse(item as string); // Parse the item from the query string
  } catch (error) {
    console.error("Failed to parse item:", error);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.itemsHeader}>Invalid item data</Text>
      </SafeAreaView>
    );
  }

  // Get the category name using the utility function
  const categoryName = getCategoryNameById(parsedItem.category_id, categories);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button with an icon instead of text */}
      <TouchableOpacity
        onPress={() => router.push("./pantry")} // Navigate back to the pantry screen
        style={styles.backButtonContainer}
      >
        <Icon
          name="arrow-left"
          size={24}
          color="black"
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Item details display */}
      <View>
        <Text style={styles.itemsHeader}>{parsedItem.name}</Text>
        <Text style={styles.itemDetails}>
          Category: {categoryName || "Unknown Category"}{" "}
        </Text>
        <Text style={styles.itemDetails}>Quantity: {parsedItem.quantity}</Text>
        {parsedItem.expiration_date ? (
          <Text style={styles.itemDetails}>
            Expires on: {parsedItem.expiration_date}
          </Text>
        ) : (
          <Text style={styles.itemDetails}>No expiration date</Text>
        )}
        <Text style={styles.itemDetails}>
          Notes: {parsedItem.notes || "No notes available"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
