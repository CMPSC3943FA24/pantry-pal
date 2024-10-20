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
  console.log("Looking for category with ID:", categoryId); // Debugging

  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown Category";
};

// Utility function for filtering pantry items based on search query and category filter
export const filterPantryItems = (
  items: any[],
  searchQuery: string,
  filterCategoryId: number | null,
  filterLocationId: number | null
): any[] => {
  let filteredItems = items;

  if (filterCategoryId !== null) {
    filteredItems = filteredItems.filter(
      (item) => item.category_id === filterCategoryId
    );
  }

  if (filterLocationId !== null) {
    filteredItems = filteredItems.filter(
      (item) => item.location_id === filterLocationId
    );
  }

  if (searchQuery) {
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filteredItems;
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

// Utility function to count items by location
export const countByLocation = (items: any[], locationId: number): number => {
  return items.filter(item => item.location_id === locationId).length;
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
