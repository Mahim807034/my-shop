import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrders = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        const id = `ORD-${Date.now().toString().slice(-8)}`;
        const newOrder = {
          ...order,
          id,
          date: new Date().toISOString(),
          status: "pending",
        };

        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      removeOrder: (id) => {
        set({ orders: get().orders.filter((o) => o.id !== id) });
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        });
      },

      clearOrders: () => set({ orders: [] }),

      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "shop-orders" }
  )
);