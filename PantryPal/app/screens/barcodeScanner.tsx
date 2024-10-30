import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { styles } from "../styles";
import { router, useFocusEffect } from "expo-router";

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannerKey, setScannerKey] = useState(0); // Use a key to force re-render

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  // Reset scanned state and force barcode scanner to remount when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false); // Reset scanned state when the screen is refocused
      setScannerKey((prevKey) => prevKey + 1); // Change key to force re-render
    }, [])
  );

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return; // Prevent multiple scans in rapid succession
    setScanned(true); // Set the scanned state to prevent further scans

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const item = await response.json();

      if (item && item.product) {
        // Ask the user if the item looks correct
        Alert.alert(
          "Item Found",
          `Name: ${item.product.product_name}\nDoes this look correct?`,
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => setScanned(false), // Allow scanning again if the user cancels
            },
            {
              text: "Yes, looks good!",
              onPress: () => {
                // Navigate to the pantry screen and prefill form details
                router.push({
                  pathname: "./pantry", // Navigate to the pantry add item form
                  params: {
                    itemName: item.product.product_name,
                    expirationDate: item.product.expiration_date || "",
                    notes: item.product.ingredients_text || "No notes available",
                  },
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "No item found for the scanned barcode.");
        setScanned(false); // Allow scanning again
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch item details.");
      setScanned(false); // Allow scanning again
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barcodeScannerContainer}>
        <BarCodeScanner
          key={scannerKey} // Force re-render of the barcode scanner when the screen is refocused
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcodeScanner}
        />
        {scanned && (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={styles.scanButton}
          >
            <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
