import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>What would you like to filter?</Text>
      <Text style={styles.subtext}>Expiring soon</Text>
      <Text style={styles.subtext}>Running Low</Text>
      <Text style={styles.subtext}>Dietary Preferences</Text>
      <Text style={styles.subtext}>Grocery Category</Text>
      <Text style={styles.subtext}>Breakfast</Text>
      <Text style={styles.subtext}>Lunch</Text>
      <Text style={styles.subtext}>Supper</Text>
      <Text style={styles.subtext}>Dessert</Text>
      <Text style={styles.subtext}>Snacks</Text>
      <Text style={styles.subtext}>Location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 16,
    marginTop: 10,
  },
});