import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  generateAdminId,
  generateAdminUsername,
  isValidEmailFormat,
} from "../utils/emailHelper";

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,

      // 🔒 Admin registration
      adminRegistered: false,
      adminEmail: "",
      adminId: "",
      adminPassword: "", // ⚠️ front-end demo only
      adminName: "",

      hasAdmin: () => get().adminRegistered,

      // ─── Verify admin identity (for reset) ───
      verifyAdminIdentity: (identifier) => {
        const clean = identifier.toLowerCase().trim();
        const adminExists = get().adminRegistered;
        const adminEmail = get().adminEmail;
        const adminId = get().adminId;

        if (!adminExists) {
          return {
            success: false,
            error: "No admin registered yet. Please signup first.",
          };
        }

        const matchesEmail = adminEmail && clean === adminEmail.toLowerCase();
        const matchesId = adminId && clean === adminId.toLowerCase();

        if (!matchesEmail && !matchesId) {
          return {
            success: false,
            error: "This email / Admin ID does not match our records.",
          };
        }

        return { success: true };
      },

      // ─── Reset admin password ───
      resetAdminPassword: (identifier, newPassword) => {
        const clean = identifier.toLowerCase().trim();
        const adminExists = get().adminRegistered;
        const adminEmail = get().adminEmail;
        const adminId = get().adminId;

        if (!adminExists) {
          return {
            success: false,
            error: "No admin registered.",
          };
        }

        if (!newPassword || newPassword.length < 6) {
          return {
            success: false,
            error: "Password must be at least 6 characters.",
          };
        }

        const matchesEmail = adminEmail && clean === adminEmail.toLowerCase();
        const matchesId = adminId && clean === adminId.toLowerCase();

        if (!matchesEmail && !matchesId) {
          return {
            success: false,
            error: "Identity verification failed.",
          };
        }

        // Save new password
        set({ adminPassword: newPassword });

        return { success: true };
      },

      // ─── SIGNUP ───
      signup: (name, email, password, role = "client") => {
        const cleanEmail = email.toLowerCase().trim();
        const adminExists = get().adminRegistered;

        if (!isValidEmailFormat(cleanEmail)) {
          return {
            success: false,
            error: "Please enter a valid email address.",
          };
        }

        if (role === "admin") {
          if (adminExists) {
            return {
              success: false,
              error:
                "An admin already exists. Only one admin is allowed per shop.",
            };
          }

          const adminId = generateAdminId(cleanEmail);
          const adminUsername = generateAdminUsername(cleanEmail);

          set({
            isAdmin: true,
            adminRegistered: true,
            adminEmail: cleanEmail,
            adminId,
            adminPassword: password,
            adminName: name,
            user: {
              name,
              email: cleanEmail,
              adminId,
              adminUsername,
              avatar: null,
              phone: "",
              address: "",
              city: "",
              bio: "",
              joinedAt: new Date().toISOString(),
              role: "admin",
            },
          });

          return { success: true, isAdmin: true, adminId };
        }

        set({
          isAdmin: false,
          user: {
            name,
            email: cleanEmail,
            avatar: null,
            phone: "",
            address: "",
            city: "",
            bio: "",
            joinedAt: new Date().toISOString(),
            role: "client",
          },
        });

        return { success: true, isAdmin: false };
      },

      // ─── LOGIN ───
      login: (identifier, password, name) => {
        const clean = identifier.toLowerCase().trim();
        const adminExists = get().adminRegistered;
        const adminEmail = get().adminEmail;
        const adminId = get().adminId;
        const adminPassword = get().adminPassword;

        const isAdminId = adminId && clean === adminId.toLowerCase();
        const isAdminEmail = adminEmail && clean === adminEmail.toLowerCase();

        if (isAdminId || isAdminEmail) {
          if (!adminExists) {
            return {
              success: false,
              error: "No admin registered yet. Please signup first.",
            };
          }

          // ⚠️ Password check (only if adminPassword is set)
          if (adminPassword && password && password !== adminPassword) {
            return {
              success: false,
              error: "Incorrect password.",
            };
          }

          set({
            isAdmin: true,
            user: {
              name:
                name ||
                get().adminName ||
                adminEmail.split("@")[0],
              email: adminEmail,
              adminId,
              adminUsername: generateAdminUsername(adminEmail),
              avatar: get().user?.avatar || null,
              phone: get().user?.phone || "",
              address: get().user?.address || "",
              city: get().user?.city || "",
              bio: get().user?.bio || "",
              joinedAt: get().user?.joinedAt || new Date().toISOString(),
              role: "admin",
            },
          });

          return { success: true, isAdmin: true };
        }

        set({
          isAdmin: false,
          user: {
            name: name || clean.split("@")[0],
            email: clean,
            avatar: get().user?.avatar || null,
            phone: get().user?.phone || "",
            address: get().user?.address || "",
            city: get().user?.city || "",
            bio: get().user?.bio || "",
            joinedAt: get().user?.joinedAt || new Date().toISOString(),
            role: "client",
          },
        });

        return { success: true, isAdmin: false };
      },

      updateProfile: (updates) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates } });
      },

      deleteAdminAccount: () => {
        set({
          adminRegistered: false,
          adminEmail: "",
          adminId: "",
          adminPassword: "",
          adminName: "",
          isAdmin: false,
          user: null,
        });
        return { success: true };
      },

      logout: () => set({ user: null, isAdmin: false }),
    }),
    { name: "shop-auth" }
  )
);