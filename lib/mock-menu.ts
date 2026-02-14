import type { MenuItemDisplay } from "@/store";

export const MOCK_MENU_ITEMS: MenuItemDisplay[] = [
  { id: "1", name: "Bruschetta", description: "Toasted bread with tomato, basil & olive oil", price: 8, category: "STARTER", imageUrl: null, isAvailable: true, sortOrder: 0 },
  { id: "2", name: "Caesar Salad", description: "Romaine, parmesan, croutons, Caesar dressing", price: 10, category: "STARTER", imageUrl: null, isAvailable: true, sortOrder: 1 },
  { id: "3", name: "Soup of the Day", description: "Ask your server for today's selection", price: 7, category: "STARTER", imageUrl: null, isAvailable: true, sortOrder: 2 },
  { id: "4", name: "Grilled Salmon", description: "With seasonal vegetables and herb butter", price: 24, category: "MAIN", imageUrl: null, isAvailable: true, sortOrder: 0 },
  { id: "5", name: "Ribeye Steak", description: "12oz, served with fries and peppercorn sauce", price: 32, category: "MAIN", imageUrl: null, isAvailable: true, sortOrder: 1 },
  { id: "6", name: "Vegetable Risotto", description: "Creamy Arborio rice with seasonal vegetables", price: 18, category: "MAIN", imageUrl: null, isAvailable: true, sortOrder: 2 },
  { id: "7", name: "Sparkling Water", description: "500ml", price: 4, category: "DRINK", imageUrl: null, isAvailable: true, sortOrder: 0 },
  { id: "8", name: "Fresh Orange Juice", description: "Freshly squeezed", price: 6, category: "DRINK", imageUrl: null, isAvailable: true, sortOrder: 1 },
  { id: "9", name: "House Wine", description: "Red or white, glass", price: 9, category: "DRINK", imageUrl: null, isAvailable: true, sortOrder: 2 },
  { id: "10", name: "Tiramisu", description: "Classic Italian dessert", price: 9, category: "DESSERT", imageUrl: null, isAvailable: true, sortOrder: 0 },
  { id: "11", name: "Chocolate Brownie", description: "With vanilla ice cream", price: 8, category: "DESSERT", imageUrl: null, isAvailable: true, sortOrder: 1 },
  { id: "12", name: "Side Fries", description: "Crispy hand-cut fries", price: 5, category: "SIDE", imageUrl: null, isAvailable: true, sortOrder: 0 },
  { id: "13", name: "Garden Salad", description: "Mixed greens, vinaigrette", price: 5, category: "SIDE", imageUrl: null, isAvailable: true, sortOrder: 1 },
];
