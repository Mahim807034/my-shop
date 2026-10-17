import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 8;

export const useRecent = create(
  persist(
    (set, get) => ({
      items: [],

      // Add product to recently viewed
      addProduct: (product) => {
        if (!product || !product.id) return;

        const current = get().items.filter(
          (p) => String(p.id) !== String(product.id)
        );

        const updated = [product, ...current].slice(0, MAX_RECENT);
        set({ items: updated });
      },

      clearRecent: () => set({ items: [] }),

      removeProduct: (id) => {
        set({
          items: get().items.filter((p) => String(p.id) !== String(id)),
        });
      },

      // Get recent products (excluding a specific id if needed)
      getRecent: (excludeId = null) => {
        const items = get().items;
        if (!excludeId) return items;
        return items.filter((p) => String(p.id) !== String(excludeId));
      },
    }),
    { name: "shop-recent-viewed" }
  )
);