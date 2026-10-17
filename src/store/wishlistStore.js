import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!product) return;
        if (get().items.find((i) => String(i.id) === String(product.id)))
          return;
        set({ items: [...get().items, product] });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => String(i.id) !== String(id)),
        });
      },

      toggleItem: (product) => {
        if (!product) return false;
        const exists = get().items.find(
          (i) => String(i.id) === String(product.id)
        );
        if (exists) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },

      isInWishlist: (id) => {
        if (!id) return false;
        return !!get().items.find((i) => String(i.id) === String(id));
      },

      count: () => get().items.length,

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "shop-wishlist" }
  )
);