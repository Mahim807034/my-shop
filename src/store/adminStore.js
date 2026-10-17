import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdmin = create(
  persist(
    (set) => ({
      isAdmin: false,
      username: "",
      email: "",

      setAdmin: (email, name) => {
        set({
          isAdmin: true,
          username: name || email.split("@")[0],
          email: email.toLowerCase().trim(),
        });
      },

      logout: () => set({ isAdmin: false, username: "", email: "" }),
    }),
    { name: "shop-admin" }
  )
);