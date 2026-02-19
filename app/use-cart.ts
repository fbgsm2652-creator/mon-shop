import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Structure alignée sur tes composants UI
interface CartItem {
  _id: string; // Utilisation de _id (Sanity style) pour la cohérence
  id?: string; // Fallback
  name: string;
  price: number;
  images: any[]; // On garde le tableau pour urlFor
  color?: string;
  capacity?: string;
  grade?: string;
  variantName?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[]; // Aligné avec cart.items dans ton UI
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void; // Aligné avec cart.removeItem
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Ajouter un produit
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === data._id);

        if (existingItem) {
          return set({
            items: currentItems.map((item) =>
              item._id === data._id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ),
          });
        }

        set({ items: [...get().items, { ...data, quantity: 1 }] });
      },

      // Supprimer un produit ( removeItem appelé par ta CartPage )
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item._id !== id)] });
      },

      // Modifier quantité
      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        });
      },

      // Vider tout
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'renw-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;