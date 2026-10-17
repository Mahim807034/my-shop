import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PRESET_THEMES = {
  greenBlue: {
    name: "Green & Blue (Default)",
    colors: {
      lightAccent: "#10b981",
      lightAccentHover: "#059669",
      lightBgPrimary: "#f0fdf4",
      lightBgSecondary: "#ffffff",
      darkAccent: "#34d399",
      darkAccentHover: "#10b981",
      darkBgPrimary: "#0a1410",
      darkBgSecondary: "#0f1a14",
    },
  },
  default: {
    name: "Yellow (Classic)",
    colors: {
      lightAccent: "#eab308",
      lightAccentHover: "#ca8a04",
      lightBgPrimary: "#fefce8",
      lightBgSecondary: "#ffffff",
      darkAccent: "#facc15",
      darkAccentHover: "#eab308",
      darkBgPrimary: "#0a0a0a",
      darkBgSecondary: "#171717",
    },
  },
  ocean: {
    name: "Ocean Blue",
    colors: {
      lightAccent: "#0ea5e9",
      lightAccentHover: "#0284c7",
      lightBgPrimary: "#f0f9ff",
      lightBgSecondary: "#ffffff",
      darkAccent: "#38bdf8",
      darkAccentHover: "#0ea5e9",
      darkBgPrimary: "#0c1420",
      darkBgSecondary: "#162130",
    },
  },
  forest: {
    name: "Forest Green",
    colors: {
      lightAccent: "#10b981",
      lightAccentHover: "#059669",
      lightBgPrimary: "#ecfdf5",
      lightBgSecondary: "#ffffff",
      darkAccent: "#34d399",
      darkAccentHover: "#10b981",
      darkBgPrimary: "#0a1410",
      darkBgSecondary: "#132119",
    },
  },
  sunset: {
    name: "Sunset Orange",
    colors: {
      lightAccent: "#f97316",
      lightAccentHover: "#ea580c",
      lightBgPrimary: "#fff7ed",
      lightBgSecondary: "#ffffff",
      darkAccent: "#fb923c",
      darkAccentHover: "#f97316",
      darkBgPrimary: "#1a0d05",
      darkBgSecondary: "#251810",
    },
  },
  rose: {
    name: "Rose Pink",
    colors: {
      lightAccent: "#ec4899",
      lightAccentHover: "#db2777",
      lightBgPrimary: "#fdf2f8",
      lightBgSecondary: "#ffffff",
      darkAccent: "#f472b6",
      darkAccentHover: "#ec4899",
      darkBgPrimary: "#1a0a14",
      darkBgSecondary: "#251520",
    },
  },
  purple: {
    name: "Royal Purple",
    colors: {
      lightAccent: "#8b5cf6",
      lightAccentHover: "#7c3aed",
      lightBgPrimary: "#faf5ff",
      lightBgSecondary: "#ffffff",
      darkAccent: "#a78bfa",
      darkAccentHover: "#8b5cf6",
      darkBgPrimary: "#0f0a1e",
      darkBgSecondary: "#1a1329",
    },
  },
  dark: {
    name: "Premium Black",
    colors: {
      lightAccent: "#1f2937",
      lightAccentHover: "#111827",
      lightBgPrimary: "#f9fafb",
      lightBgSecondary: "#ffffff",
      darkAccent: "#e5e7eb",
      darkAccentHover: "#f3f4f6",
      darkBgPrimary: "#030712",
      darkBgSecondary: "#0f172a",
    },
  },
};

const DEFAULT_CUSTOMIZATION = {
  preset: "greenBlue",
  enabled: false,
  colors: PRESET_THEMES.greenBlue.colors,
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    baseSize: 16,
    headingWeight: 700,
  },
  layout: {
    radius: 12,
    containerWidth: 1152,
  },
  effects: {
    animations: true,
    hoverScale: true,
    shadows: "medium",
  },
};

export const useThemeCustom = create(
  persist(
    (set, get) => ({
      customization: DEFAULT_CUSTOMIZATION,

      updateCustomization: (updates) => {
        const current = get().customization;
        const next = {
          ...current,
          ...updates,
          colors: { ...current.colors, ...(updates.colors || {}) },
          typography: { ...current.typography, ...(updates.typography || {}) },
          layout: { ...current.layout, ...(updates.layout || {}) },
          effects: { ...current.effects, ...(updates.effects || {}) },
        };
        set({ customization: next });
        applyCustomization(next);
      },

      applyPreset: (presetKey) => {
        const preset = PRESET_THEMES[presetKey];
        if (!preset) return;

        const current = get().customization;
        const next = {
          ...current,
          preset: presetKey,
          colors: { ...preset.colors },
        };
        set({ customization: next });
        applyCustomization(next);
      },

      enableCustomization: () => {
        const current = get().customization;
        const next = { ...current, enabled: true };
        set({ customization: next });
        applyCustomization(next);
      },

      disableCustomization: () => {
        const current = get().customization;
        const next = { ...current, enabled: false };
        set({ customization: next });
        applyCustomization(next);
      },

      resetCustomization: () => {
        set({ customization: DEFAULT_CUSTOMIZATION });
        applyCustomization(DEFAULT_CUSTOMIZATION);
      },

      exportCustomization: () => {
        return JSON.stringify(get().customization, null, 2);
      },

      importCustomization: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          const next = { ...parsed, enabled: true };
          set({ customization: next });
          applyCustomization(next);
          return { success: true };
        } catch (e) {
          return { success: false, error: "Invalid JSON" };
        }
      },

      initCustomization: () => {
        applyCustomization(get().customization);
      },
    }),
    { name: "shop-theme-custom" }
  )
);

export function applyCustomization(custom) {
  if (typeof document === "undefined") return;

  const styleId = "dynamic-theme-overrides";
  let styleEl = document.getElementById(styleId);

  if (!custom || !custom.enabled) {
    if (styleEl) styleEl.textContent = "";
    return;
  }

  const shadowMap = {
    none: "none",
    subtle: "0 1px 2px rgba(0,0,0,0.05)",
    medium: "0 4px 6px rgba(0,0,0,0.1)",
    dramatic: "0 10px 25px rgba(0,0,0,0.2)",
  };

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    :root {
      --accent: ${custom.colors.lightAccent};
      --accent-hover: ${custom.colors.lightAccentHover};
      --bg-primary: ${custom.colors.lightBgPrimary};
      --bg-secondary: ${custom.colors.lightBgSecondary};
      --radius: ${custom.layout.radius}px;
      --container-width: ${custom.layout.containerWidth}px;
      --shadow: ${shadowMap[custom.effects.shadows] || shadowMap.medium};
    }
    .dark {
      --accent: ${custom.colors.darkAccent};
      --accent-hover: ${custom.colors.darkAccentHover};
      --bg-primary: ${custom.colors.darkBgPrimary};
      --bg-secondary: ${custom.colors.darkBgSecondary};
    }
    html, body {
      font-family: ${custom.typography.fontFamily};
      font-size: ${custom.typography.baseSize}px;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: ${custom.typography.headingWeight};
    }
    .max-w-6xl {
      max-width: ${custom.layout.containerWidth}px !important;
    }
    ${
      !custom.effects.animations
        ? `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.05ms !important;
      }
    `
        : ""
    }
    ${
      !custom.effects.hoverScale
        ? `
      .hover\\:scale-105:hover,
      .hover\\:scale-110:hover,
      .hover\\:scale-\\[1\\.02\\]:hover {
        transform: none !important;
      }
    `
        : ""
    }
  `;
}