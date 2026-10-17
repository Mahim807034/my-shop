import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_COMPONENTS = {
  enabled: false,
  navbar: {
    height: 64,
    bgLight: "#ffffff",
    bgDark: "#171717",
    textLight: "#1e293b",
    textDark: "#f5f5f5",
    logoColor: "#eab308",
    sticky: true,
    borderBottom: true,
    shadow: "subtle",
  },
  hero: {
    gradientFrom: "#eab308",
    gradientTo: "#ca8a04",
    textColor: "#ffffff",
    buttonBg: "#ffffff",
    buttonText: "#1e293b",
    height: "medium", // small | medium | large
    rounded: false,
  },
  productCard: {
    bgLight: "#ffffff",
    bgDark: "#171717",
    borderColor: "#e2e8f0",
    borderRadius: 12,
    hoverEffect: "lift", // none | lift | scale | glow
    imageRatio: "square", // square | portrait | landscape
    showRating: true,
    showCategory: true,
    shadow: "medium",
  },
  buttons: {
    primaryBg: "#eab308",
    primaryText: "#ffffff",
    radius: 12,
    shadow: "medium",
    hoverEffect: "scale", // none | scale | darken
    uppercase: false,
  },
  footer: {
    bgLight: "#fefce8",
    bgDark: "#171717",
    textLight: "#64748b",
    textDark: "#a3a3a3",
    columns: 3, // 2 | 3 | 4
    showSocial: true,
    socialStyle: "circle", // circle | square | none
    showLegalLinks: true,
  },
  forms: {
    bgLight: "#ffffff",
    bgDark: "#171717",
    borderColor: "#e2e8f0",
    radius: 12,
    borderWidth: 1,
    focusRing: true,
  },
  global: {
    borderRadius: 12,
    containerWidth: 1152,
    sectionSpacing: "medium", // small | medium | large
    animationsEnabled: true,
  },
};

export const useComponentCustom = create(
  persist(
    (set, get) => ({
      components: DEFAULT_COMPONENTS,

      updateComponent: (section, updates) => {
        const current = get().components;
        const next = {
          ...current,
          enabled: true,
          [section]: { ...current[section], ...updates },
        };
        set({ components: next });
        applyComponentCustomization(next);
      },

      enableComponents: () => {
        const next = { ...get().components, enabled: true };
        set({ components: next });
        applyComponentCustomization(next);
      },

      disableComponents: () => {
        const next = { ...get().components, enabled: false };
        set({ components: next });
        applyComponentCustomization(next);
      },

      resetComponents: () => {
        set({ components: DEFAULT_COMPONENTS });
        applyComponentCustomization(DEFAULT_COMPONENTS);
      },

      importComponents: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          const next = { ...parsed, enabled: true };
          set({ components: next });
          applyComponentCustomization(next);
          return { success: true };
        } catch (e) {
          return { success: false, error: "Invalid JSON" };
        }
      },

      exportComponents: () => {
        return JSON.stringify(get().components, null, 2);
      },

      initComponents: () => {
        applyComponentCustomization(get().components);
      },
    }),
    { name: "shop-component-custom" }
  )
);

/* 🎯 Apply component customizations as CSS variables + dynamic CSS */
export function applyComponentCustomization(custom) {
  if (typeof document === "undefined") return;

  const styleId = "component-theme-overrides";
  let styleEl = document.getElementById(styleId);

  if (!custom || !custom.enabled) {
    if (styleEl) styleEl.textContent = "";
    return;
  }

  const {
    navbar,
    hero,
    productCard,
    buttons,
    footer,
    forms,
    global,
  } = custom;

  // Shadow helper
  const shadowMap = {
    none: "none",
    subtle: "0 1px 2px rgba(0,0,0,0.05)",
    medium: "0 4px 6px rgba(0,0,0,0.1)",
    dramatic: "0 10px 25px rgba(0,0,0,0.2)",
  };

  const heroHeights = {
    small: { py: "3rem", minH: "300px" },
    medium: { py: "5rem", minH: "400px" },
    large: { py: "8rem", minH: "500px" },
  };

  const sectionSpacings = {
    small: "2rem",
    medium: "4rem",
    large: "6rem",
  };

  const imageAspects = {
    square: "1 / 1",
    portrait: "3 / 4",
    landscape: "16 / 10",
  };

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const hoverLift = productCard.hoverEffect === "lift";
  const hoverScale = productCard.hoverEffect === "scale";
  const hoverGlow = productCard.hoverEffect === "glow";

  styleEl.textContent = `
    /* ═══════════════ NAVBAR ═══════════════ */
    nav[class*="sticky"] {
      ${navbar.sticky ? "" : "position: relative !important;"}
      height: ${navbar.height}px !important;
      background: var(--bg-secondary) !important;
      border-bottom: ${navbar.borderBottom ? `1px solid var(--border)` : "none"} !important;
      box-shadow: ${shadowMap[navbar.shadow] || shadowMap.subtle} !important;
    }
    nav > div:first-child {
      height: ${navbar.height}px !important;
    }
    nav a[href="/"] {
      color: ${navbar.logoColor} !important;
    }
    :root {
      --navbar-height: ${navbar.height}px;
    }

    /* ═══════════════ HERO ═══════════════ */
    section[class*="gradient"]:first-of-type,
    section[style*="linear-gradient(135deg, var(--accent)"] {
      background: linear-gradient(135deg, ${hero.gradientFrom} 0%, ${hero.gradientTo} 100%) !important;
      padding-top: ${heroHeights[hero.height].py} !important;
      padding-bottom: ${heroHeights[hero.height].py} !important;
      min-height: ${heroHeights[hero.height].minH} !important;
      ${hero.rounded ? "border-radius: 0 0 24px 24px !important;" : ""}
    }
    section[class*="gradient"] h1,
    section[class*="gradient"] p {
      color: ${hero.textColor} !important;
    }
    section[class*="gradient"] a[href="/products"] {
      background: ${hero.buttonBg} !important;
      color: ${hero.buttonText} !important;
    }

    /* ═══════════════ PRODUCT CARDS ═══════════════ */
    .group[class*="rounded-xl"][class*="border"] {
      border-radius: ${productCard.borderRadius}px !important;
      box-shadow: ${shadowMap[productCard.shadow] || shadowMap.medium} !important;
    }
    .group[class*="rounded-xl"][class*="border"] > a:first-child > div,
    .group[class*="rounded-xl"][class*="border"] > a:first-child {
      aspect-ratio: ${imageAspects[productCard.imageRatio]} !important;
    }
    ${
      hoverLift
        ? `
      .group[class*="rounded-xl"][class*="border"]:hover {
        transform: translateY(-8px) !important;
      }
    `
        : ""
    }
    ${
      hoverScale
        ? `
      .group[class*="rounded-xl"][class*="border"]:hover {
        transform: scale(1.04) !important;
      }
    `
        : ""
    }
    ${
      hoverGlow
        ? `
      .group[class*="rounded-xl"][class*="border"]:hover {
        box-shadow: 0 0 25px ${productCard.borderColor}80 !important;
      }
    `
        : ""
    }

    /* ═══════════════ BUTTONS ═══════════════ */
    button[style*="background: var(--accent)"],
    button[style*="background: rgb"],
    a[style*="background: var(--accent)"] {
      border-radius: ${buttons.radius}px !important;
      box-shadow: ${shadowMap[buttons.shadow] || shadowMap.medium} !important;
      ${buttons.uppercase ? "text-transform: uppercase !important; letter-spacing: 0.05em !important;" : ""}
    }
    ${
      buttons.hoverEffect === "scale"
        ? `
      button[style*="var(--accent)"]:hover,
      a[style*="var(--accent)"]:hover {
        transform: scale(1.05) !important;
      }
    `
        : ""
    }
    ${
      buttons.hoverEffect === "darken"
        ? `
      button[style*="var(--accent)"]:hover,
      a[style*="var(--accent)"]:hover {
        filter: brightness(0.9) !important;
        transform: none !important;
      }
    `
        : ""
    }

    /* ═══════════════ FORMS ═══════════════ */
    input[class*="border"],
    textarea[class*="border"],
    select[class*="border"] {
      border-radius: ${forms.radius}px !important;
      border-width: ${forms.borderWidth}px !important;
    }
    ${
      forms.focusRing
        ? `
      input[class*="border"]:focus,
      textarea[class*="border"]:focus,
      select[class*="border"]:focus {
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 3px var(--accent)40 !important;
      }
    `
        : ""
    }

    /* ═══════════════ FOOTER ═══════════════ */
    footer {
      background: var(--footer-bg) !important;
    }
    :root {
      --footer-bg: ${footer.bgLight};
    }
    .dark {
      --footer-bg: ${footer.bgDark};
    }
    footer a {
      color: var(--footer-text) !important;
    }
    :root {
      --footer-text: ${footer.textLight};
    }
    .dark {
      --footer-text: ${footer.textDark};
    }
    footer > div > div:first-child {
      grid-template-columns: ${
        footer.columns === 2
          ? "1fr 1fr"
          : footer.columns === 4
          ? "repeat(4, 1fr)"
          : "repeat(3, 1fr)"
      } !important;
    }

    /* ═══════════════ GLOBAL SPACING ═══════════════ */
    section {
      --section-spacing: ${sectionSpacings[global.sectionSpacing]};
    }
    :root {
      --radius: ${global.borderRadius}px;
      --container-width: ${global.containerWidth}px;
    }
    .max-w-6xl {
      max-width: ${global.containerWidth}px !important;
    }
    ${
      !global.animationsEnabled
        ? `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.05ms !important;
      }
    `
        : ""
    }
  `;
}