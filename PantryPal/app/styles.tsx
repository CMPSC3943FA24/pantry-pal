import { StyleSheet } from "react-native";

// Styles for the components
export const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 150,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#a6a6a6",
    padding: 9,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 20,
  },
  quantityButton: {
    backgroundColor: "#a6a6a6",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 50, // Adjust width as needed
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
    width: "25%",    
  },
  filterText: {
    color: "#000",
  },
  fridgeButton: {
    backgroundColor: "#1c88e9",
  },
  freezerButton: {
    backgroundColor: "#77f2c5",
  },
  pantryButton: {
    backgroundColor: "#38761d",
  },
  expiringSoonButton: {
    backgroundColor: "#cc0000",
  },
  runningLowButton: {
    backgroundColor: "#ffd966",
  },
  filterCategoryModalButton: {
    backgroundColor: "f07fd9",
  },
  recentItemsContainer: {
    padding: 20,
  },
  recentItemsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noItemsText: {
    textAlign: "center",
    color: "#999",
  },
  itemContainer: {
    backgroundColor: "white",
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10, // For some spacing between the text and the trash icon
  },
  itemContent: {
    flexDirection: "column",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDetails: {
    fontSize: 18,
    marginVertical: 5,
  },
  trashIcon: {
    padding: 5,
    backgroundColor: "transparent",
  },
  badge: {
    padding: 5,
    borderRadius: 5,
    color: "white",
  },
  fridgeBadge: {
    backgroundColor: "#FFDB5C",
  },
  freezerBadge: {
    backgroundColor: "#7AA0FF",
  },
  pantryBadge: {
    backgroundColor: "#FF8F8F",
  },
  expiringSoonBadge: {
    backgroundColor: "ffcc00"
  },
  filterCategoryModalBadge: {
    backgroundColor: "f07fd9",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    height: "80%",
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
    borderColor: "#ddd",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
  },
  picker: {
    height: 200,
    width: "100%",
  },
  dropdown: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ddd",
  },
  dropdownMenu: {
    width: "85%",
  },
  dropdownText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20, // Ensures there's space at the bottom
  },
  itemBackgroundLight: {
    backgroundColor: "#f9f9f9",
  },
  itemBackgroundDark: {
    backgroundColor: "#e9e9e9",
  },
  itemsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  floatingButtonAdd: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#28a745", // Green for the add button
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  floatingButtonDelete: {
    position: "absolute",
    bottom: 20,
    right: 100,
    backgroundColor: "#dc3545", // Red for the delete button
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#cccccc", // Gray for the "All" button
  },
  homeContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  navigateButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
