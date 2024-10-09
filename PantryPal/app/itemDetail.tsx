import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ItemDetail({ route }: { route: any }) {
  const { item } = route.params; // Get the item passed from the main screen

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{item.name}</Text>
      <Text style={styles.details}>Category ID: {item.category_id}</Text>
      <Text style={styles.details}>Quantity: {item.quantity}</Text>
      {item.expiration_date ? (
        <Text style={styles.details}>Expires on: {item.expiration_date}</Text>
      ) : (
        <Text style={styles.details}>No expiration date</Text>
      )}
      <Text style={styles.details}>Notes: {item.notes || 'No notes available'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
    marginVertical: 5,
  },
});
