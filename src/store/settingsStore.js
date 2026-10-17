import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettings = create(
  persist(
    (set, get) => ({
      settings: {
        siteName: "My Shop",
        tagline: "Quality products at affordable prices",
        whatsapp: "8801XXXXXXXXX",
        phone: "+880 1XXX-XXXXXX",
        email: "info@myshop.com",
        address: "Dhaka, Bangladesh",
        deliveryCharge: 60,
        currency: "৳",
      },
      updateSettings: (updates) => {
        set({ settings: { ...get().settings, ...updates } });
      },
      resetSettings: () => {
        set({
          settings: {
            siteName: "My Shop",
            tagline: "Quality products at affordable prices",
            whatsapp: "8801XXXXXXXXX",
            phone: "+880 1XXX-XXXXXX",
            email: "info@myshop.com",
            address: "Dhaka, Bangladesh",
            deliveryCharge: 60,
            currency: "৳",
          },
        });
      },
    }),
    { name: "shop-settings" }
  )
);