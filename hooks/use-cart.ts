import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from "react-hot-toast";

// Interface stricte pour éviter les erreurs de build
interface Product {
  _id: string;
  name: string;
  price: number; // On force le number pour la fiabilité des calculs
  images: any[];
  quantity?: number;
  [key: string]: any;
}

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // AJOUTER UN PRODUIT
      addItem: (data: Product) => {
        const currentItems = get().items;
        const isExisting = currentItems.find((item) => item._id === data._id);

        if (isExisting) {
          return toast.error("Cet article est déjà dans votre panier.");
        }

        // On s'assure que le prix est bien un nombre avant l'ajout
        const formattedData = {
          ...data,
          price: Number(data.price)
        };

        set({ items: [...currentItems, formattedData] });
      },

      // SUPPRIMER UN PRODUIT
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item._id !== id) });
        toast.success("Article retiré.");
      },

      // VIDER LE PANIER
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // Clé localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;