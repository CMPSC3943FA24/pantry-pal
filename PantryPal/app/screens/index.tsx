import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { styles } from "../styles";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeContent}>
        <Text style={styles.welcomeText}>Welcome to Pantry Pal!</Text>
        <Text style={styles.subtitleText}>
          Manage your pantry items with ease.
        </Text>
      </View>
    </SafeAreaView>
  );
}
