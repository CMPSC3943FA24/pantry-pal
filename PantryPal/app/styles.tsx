import { StyleSheet } from 'react-native';

// Styles for the components
export const styles = StyleSheet.create({
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
    clearButton: {
      backgroundColor: '#FFDB4C',
    },
    sortButton: {
      backgroundColor: '#3AAFBA'
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
  