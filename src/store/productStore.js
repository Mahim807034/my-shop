import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as defaultProducts } from "../data/products";

export const useProducts = create(
  persist(
    (set, get) => ({
      products: defaultProducts,

      addProduct: (product) => {
        const id = product.id || Date.now().toString().slice(-6);
        const newProduct = {
          ...product,
          id,
          images: product.images || (product.image ? [product.image] : []),
        };
        set({ products: [newProduct, ...get().products] });
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            String(p.id) === String(id) ? { ...p, ...updates } : p
          ),
        });
      },

      removeProduct: (id) => {
        set({
          products: get().products.filter(
            (p) => String(p.id) !== String(id)
          ),
        });
      },

      getProduct: (id) =>
        get().products.find((p) => String(p.id) === String(id)),

      resetProducts: () => set({ products: defaultProducts }),
    }),
    {
      name: "shop-products",
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState?.products) {
          persistedState.products = persistedState.products.map((p) => ({
            ...p,
            images: p.images || (p.image ? [p.image] : []),
          }));
        }
        return persistedState;
      },
    }
  )
);