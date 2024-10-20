import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For adding icons to the tabs

export default function ScreensLayout() {
  return (
    <Tabs>
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false, // Hide header for home
        }}
      />

      {/* Pantry Tab */}
      <Tabs.Screen
        name="pantry"
        options={{
          title: "Pantry",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
          headerShown: false, // Hide header for pantry screen
        }}
      />

      {/* Item Detail (Hidden in tabs, but accessible through navigation) */}
      <Tabs.Screen
        name="itemDetail"
        options={{
          title: "Item Detail",
          tabBarButton: () => null, // Hide from tab bar but still accessible
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="barcodeScanner"
        options={{
          title: "Barcode Scanner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barcode" size={size} color={color} />
          ),
          headerShown: false, // Hide header for pantry screen
        }}
      />
    </Tabs>
  );
}
