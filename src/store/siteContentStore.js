import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_CONTENT = {
  enabled: true,

  global: {
    siteName: "My Shop",
    tagline: "Quality products at affordable prices",
    currency: "৳",
    deliveryCharge: 60,
    whatsapp: "8801XXXXXXXXX",
    primaryColor: "#10b981",
    secondaryColor: "#3b82f6",
    accentColor: "#0ea5e9",
  },

  announcement: {
    enabled: false,
    text: "🎉 Free delivery on orders over ৳2000!",
    bgColor: "#10b981",
    textColor: "#ffffff",
    closable: true,
  },

  navbar: {
    logoText: "My Shop",
    logoImage: "",
    showLogoImage: false,
    menuItems: [
      { label: "Home", to: "/" },
      { label: "Products", to: "/products" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
    showWishlist: true,
    showCart: true,
    showSearch: false,
    height: 64,
    bgColorLight: "#ffffff",
    bgColorDark: "#0f1a14",
    textColorLight: "#0f172a",
    textColorDark: "#f0fdf4",
    logoColor: "#10b981",
    sticky: true,
    borderBottom: true,
    shadow: "subtle",
    blur: true,
  },

  hero: {
    enabled: true,
    title: "Welcome to My Shop",
    subtitle:
      "Quality products at affordable prices. Fast delivery all over Bangladesh.",
    image: "",
    imagePosition: "right",
    bgType: "gradient",
    gradientFrom: "#10b981",
    gradientTo: "#3b82f6",
    solidColor: "#10b981",
    bgImage: "",
    textColor: "#ffffff",
    overlayOpacity: 0.4,
    bgImagePosition: "center",
    bgImageSize: "cover",
    bgImageRepeat: "no-repeat",
    bgImageOpacity: 1,
    bgImageBlur: 0,
    bgImageBrightness: 1,
    overlayColor: "#000000",
    overlayGradient: false,
    overlayGradientFrom: "#000000",
    overlayGradientTo: "transparent",
    overlayGradientDirection: "to-top",
    customMinHeight: 0,
    buttonPrimary: {
      text: "Shop Now",
      to: "/products",
      bgColor: "#ffffff",
      textColor: "#10b981",
    },
    buttonSecondary: {
      enabled: false,
      text: "Learn More",
      to: "/about",
      bgColor: "transparent",
      textColor: "#ffffff",
    },
    alignment: "center",
    height: "medium",
  },

  features: {
    enabled: true,
    title: "Why Choose Us",
    subtitle: "",
    items: [
      { icon: "🚚", title: "Fast Delivery", desc: "2-3 days all over BD" },
      { icon: "✅", title: "Quality Products", desc: "100% authentic" },
      { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
    ],
  },

  featuredProducts: {
    enabled: true,
    title: "Featured Products",
    subtitle: "",
    count: 4,
    viewAllText: "View All",
    viewAllLink: "/products",
  },

  aboutSection: {
    enabled: true,
    title: "About Us",
    description:
      "We are a trusted online shop providing quality products at affordable prices across Bangladesh. Trusted by thousands of happy customers.",
    bgType: "solid",
    solidColor: "#ffffff",
    gradientFrom: "#10b981",
    gradientTo: "#3b82f6",
    bgImage: "",
    textColor: "",
    textColorCustom: "#ffffff",
    bgImagePosition: "center",
    bgImageSize: "cover",
    bgImageRepeat: "no-repeat",
    bgImageOpacity: 1,
    bgImageBlur: 0,
    bgImageBrightness: 1,
    overlayOpacity: 0.5,
    overlayColor: "#000000",
    overlayGradient: false,
    overlayGradientFrom: "#000000",
    overlayGradientTo: "transparent",
    overlayGradientDirection: "to-top",
    customMinHeight: 0,
    image: "",
    stats: [
      { value: "10K+", label: "Happy Customers" },
      { value: "500+", label: "Products" },
      { value: "5+", label: "Years" },
      { value: "99%", label: "Satisfaction" },
    ],
  },

  footer: {
    description:
      "Quality products at affordable prices. Trusted by thousands of customers across Bangladesh.",
    columns: [
      {
        title: "Quick Links",
        links: [
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: "About", to: "/about" },
          { label: "Contact", to: "/contact" },
        ],
      },
      {
        title: "My Account",
        links: [
          { label: "Profile", to: "/profile" },
          { label: "Orders", to: "/orders" },
          { label: "Wishlist", to: "/wishlist" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "FAQ", to: "/faq" },
          { label: "Terms", to: "/terms" },
          { label: "Privacy", to: "/privacy" },
        ],
      },
    ],
    contactInfo: {
      showPhone: true,
      showEmail: true,
      showAddress: true,
    },
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      whatsapp: "",
    },
    copyright: "© 2025 My Shop. All rights reserved.",
    creditText: "Made with ❤️ in Bangladesh",
  },

  cta: {
    enabled: true,
    title: "Ready to shop with us?",
    subtitle:
      "Browse our collection and enjoy fast delivery across Bangladesh.",
    buttonText: "Shop Now",
    buttonLink: "/products",
  },
};

export const useSiteContent = create(
  persist(
    (set, get) => ({
      content: DEFAULT_CONTENT,
      draft: DEFAULT_CONTENT,

      hasChanges: () => {
        const { content, draft } = get();
        return JSON.stringify(content) !== JSON.stringify(draft);
      },

      updateDraft: (section, updates) => {
        const current = get().draft;
        set({
          draft: {
            ...current,
            [section]: { ...current[section], ...updates },
          },
        });
      },

      setDraftSection: (section, data) => {
        set({
          draft: { ...get().draft, [section]: data },
        });
      },

      setDraft: (data) => {
        set({ draft: data });
      },

      save: () => {
        set({ content: get().draft });
        return { success: true };
      },

      discard: () => {
        set({ draft: get().content });
        return { success: true };
      },

      resetSection: (section) => {
        const current = get().draft;
        set({
          draft: {
            ...current,
            [section]: DEFAULT_CONTENT[section],
          },
        });
      },

      resetAll: () => {
        set({
          content: DEFAULT_CONTENT,
          draft: DEFAULT_CONTENT,
        });
      },

      exportContent: () => JSON.stringify(get().draft, null, 2),

      importContent: (json) => {
        try {
          const parsed = JSON.parse(json);
          set({
            content: parsed,
            draft: parsed,
          });
          return { success: true };
        } catch (e) {
          return { success: false, error: "Invalid JSON" };
        }
      },

      init: () => {
        set({ draft: get().content });
      },
    }),
    { name: "shop-site-content" }
  )
);

export const DEFAULT_SITE_CONTENT = DEFAULT_CONTENT;