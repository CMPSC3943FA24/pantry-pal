// utils.tsx

// Interface for Category
export interface Category {
  id: number;
  name: string;
}

// Utility function to get category name by ID
export const getCategoryNameById = (
  categoryId: number,
  categories: Category[]
): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown Category";
};

//Utility function to search items and filter by expiration date
import {PantryItem} from "./databaseService";
export const filterPantryItems = (
  items: PantryItem[],
  searchQuery: string,
  filterCategoryId: number | string | null
) => {
  const currentDate = new Date();
  const daysUntilExpiringSoon = 7; // Adjust as necessary
  const expiringSoonDate = new Date(currentDate);
  expiringSoonDate.setDate(currentDate.getDate() + daysUntilExpiringSoon);
  
  return items.filter((item) => {
    const itemExpirationDate = new Date(item.expiration_date);
    
    // Match search query (case insensitive)
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    // Match category or handle "expiring soon"
    const matchesCategory =
      filterCategoryId === null ||
      item.category_id === Number(filterCategoryId) ||
      (filterCategoryId === "Fridge" && item.location_id === 1) ||
      (filterCategoryId === "Freezer" && item.location_id === 2) ||
      (filterCategoryId === "Pantry" && item.location_id === 3) ||
      (filterCategoryId === "expiringSoon" && itemExpirationDate <= expiringSoonDate) ||
      (filterCategoryId === "expired" && itemExpirationDate < currentDate);
    return matchesSearch && matchesCategory;
  });
};


// Utility function for handling search input change
export const handleSearch = (
  query: string,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
) => {
  setSearchQuery(query);
};

// Utility function for counting items by location
export const countByLocation = (items: any[], locationId: number) => {
  return items.filter((item) => item.location_id === locationId).length;
};

// Utility function for resetting form fields
export const resetFormFields = (
  setItemName: React.Dispatch<React.SetStateAction<string>>,
  setLocation: React.Dispatch<React.SetStateAction<number | null>>,
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<number | null>>,
  setExpirationDate: React.Dispatch<React.SetStateAction<string>>,
  setQuantity: React.Dispatch<React.SetStateAction<number>>,
  setNotes: React.Dispatch<React.SetStateAction<string>>
) => {
  setItemName("");
  setLocation(null);
  setSelectedCategoryId(null);
  setExpirationDate("");
  setQuantity(0);
  setNotes("");
};
