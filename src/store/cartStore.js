import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      // 🛒 Regular add to cart
      addItem: (product) => {
        const items = get().items;
        const existing = items.find(
          (i) => String(i.id) === String(product.id)
        );

        if (existing) {
          set({
            items: items.map((i) =>
              String(i.id) === String(product.id)
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      // 🛒 Add with specific quantity
      addItemWithQty: (product, qty) => {
        const items = get().items;
        const existing = items.find(
          (i) => String(i.id) === String(product.id)
        );

        if (existing) {
          set({
            items: items.map((i) =>
              String(i.id) === String(product.id)
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: qty }] });
        }
      },

      // ⚡ Buy Now — replaces cart with single item temporarily, but keeps original
      buyNow: (product, qty = 1) => {
        // Store current cart as backup
        const currentItems = get().items;

        // Set cart to just this product
        set({
          items: [{ ...product, quantity: qty }],
          _buyNowBackup: currentItems,
          _isBuyNow: true,
        });

        return true;
      },

      // Restore original cart after buy now (if user cancels)
      restoreCart: () => {
        const backup = get()._buyNowBackup;
        if (backup) {
          set({
            items: backup,
            _buyNowBackup: null,
            _isBuyNow: false,
          });
        }
      },

      // Clear buy now flag
      clearBuyNowFlag: () => {
        set({ _buyNowBackup: null, _isBuyNow: false });
      },

      removeItem: (id) =>
        set({
          items: get().items.filter((i) => String(i.id) !== String(id)),
        }),

      updateQuantity: (id, qty) =>
        set({
          items: get().items.map((i) =>
            String(i.id) === String(id)
              ? { ...i, quantity: Math.max(1, qty) }
              : i
          ),
        }),

      clearCart: () =>
        set({
          items: [],
          _buyNowBackup: null,
          _isBuyNow: false,
        }),

      total: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      count: () =>
        get().items.reduce((s, i) => s + i.quantity, 0),

      isBuyNow: () => get()._isBuyNow || false,
    }),
    { name: "shop-cart" }
  )
);