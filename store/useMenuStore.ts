import { create } from "zustand";

export type MenuItemDisplay = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

type MenuState = {
  items: MenuItemDisplay[];
  setItems: (items: MenuItemDisplay[]) => void;
  getByCategory: (category: string) => MenuItemDisplay[];
  getItemById: (id: string) => MenuItemDisplay | undefined;
};

export const useMenuStore = create<MenuState>()((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  getByCategory: (category) =>
    get().items
      .filter((i) => i.category === category && i.isAvailable)
      .sort((a, b) => a.sortOrder - b.sortOrder),

  getItemById: (id) => get().items.find((i) => i.id === id),
}));
