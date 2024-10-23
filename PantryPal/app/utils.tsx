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

// Utility function for filtering pantry items based on search query and category filter
import { PantryItem } from "./screens/pantry";
export const filterPantryItems = (
  items: PantryItem[],
  searchQuery: string,
  filterCategoryId: number | string | null
) => {
  const currentDate = new Date();
  const daysUntilExpiringSoon = 7; //Adjust as necessary 7 means expiring in 7 days
  const expiringSoonDate = new Date();
  expiringSoonDate.setDate(currentDate.getDate() + daysUntilExpiringSoon);
  
  return items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = 
    filterCategoryId === null ||
    item.category_id === filterCategoryId ||
    (filterCategoryId === "expiringSoon" &&
      new Date(item.expiration_date) <= expiringSoonDate &&
      new Date(item.expiration_date) >= currentDate);
    
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

// Utility function for counting items by category
export const countByCategory = (items: any[], categoryId: number) => {
  return items.filter((item) => item.category_id === categoryId).length;
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
