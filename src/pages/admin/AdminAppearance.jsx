import { useState, useEffect, useRef } from "react";
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Check,
  Eye,
  Save,
  Power,
  AlertCircle,
  Layers,
  Navigation,
  Image,
  Package,
  MousePointerClick,
  AlignJustify,
  FileInput,
  Globe,
} from "lucide-react";
import {
  useThemeCustom,
  PRESET_THEMES,
} from "../../store/themeCustomStore";
import { useComponentCustom } from "../../store/componentCustomStore";
import toast from "react-hot-toast";

const FONT_OPTIONS = [
  {
    label: "Inter (Modern)",
    value:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  { label: "Poppins (Friendly)", value: "'Poppins', system-ui, sans-serif" },
  { label: "Roboto (Clean)", value: "'Roboto', system-ui, sans-serif" },
  { label: "Montserrat (Bold)", value: "'Montserrat', system-ui, sans-serif" },
  {
    label: "Playfair (Elegant)",
    value: "'Playfair Display', Georgia, serif",
  },
];

export default function AdminAppearance() {
  const {
    customization,
    updateCustomization,
    applyPreset,
    enableCustomization,
    disableCustomization,
    resetCustomization,
  } = useThemeCustom();

  const {
    components,
    updateComponent,
    enableComponents,
    disableComponents,
    resetComponents,
    exportComponents,
    importComponents,
  } = useComponentCustom();

  const [activeTab, setActiveTab] = useState("components");
  const [activeComponent, setActiveComponent] = useState("navbar");
  const [localComponents, setLocalComponents] = useState(components);
  const [localColors, setLocalColors] = useState(customization);
  const importRef = useRef(null);

  useEffect(() => {
    setLocalComponents(components);
  }, [components]);

  useEffect(() => {
    setLocalColors(customization);
  }, [customization]);

  /* ═══════════ COMPONENT UPDATES ═══════════ */
  const updateComp = (key, value) => {
    const next = {
      ...localComponents,
      enabled: true,
      [activeComponent]: {
        ...localComponents[activeComponent],
        [key]: value,
      },
    };
    setLocalComponents(next);
    updateComponent(activeComponent, { [key]: value });
  };

  /* ═══════════ MASTER SWITCH ═══════════ */
  const handleMasterToggle = () => {
    if (components.enabled) {
      disableComponents();
      setLocalComponents({ ...components, enabled: false });
      toast.success("Component customization disabled");
    } else {
      enableComponents();
      setLocalComponents({ ...components, enabled: true });
      toast.success("Component customization enabled");
    }
  };

  /* ═══════════ IMPORT/EXPORT ═══════════ */
  const handleExport = () => {
    const json = exportComponents();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component-customization.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importComponents(ev.target.result);
      if (result.success) {
        toast.success("Imported!");
        setLocalComponents(useComponentCustom.getState().components);
      } else {
        toast.error(result.error);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const componentTabs = [
    { key: "navbar", label: "Navbar", icon: Navigation },
    { key: "hero", label: "Hero Section", icon: Image },
    { key: "productCard", label: "Product Card", icon: Package },
    { key: "buttons", label: "Buttons", icon: MousePointerClick },
    { key: "footer", label: "Footer", icon: AlignJustify },
    { key: "forms", label: "Forms / Inputs", icon: FileInput },
    { key: "global", label: "Global", icon: Globe },
  ];

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  const isEnabled = components.enabled;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Website Appearance
        </h1>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Customize individual components — Navbar, Hero, Cards, Buttons, and
          more
        </p>
      </div>

      {/* MASTER SWITCH */}
      <div
        className="mb-5 p-4 sm:p-5 rounded-2xl border-2 transition-all"
        style={{
          background: isEnabled
            ? "linear-gradient(135deg, var(--accent)15 0%, var(--accent-hover)10 100%)"
            : "var(--bg-secondary)",
          borderColor: isEnabled ? "var(--accent)" : "var(--border)",
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isEnabled ? "var(--accent)" : "var(--bg-primary)",
                color: isEnabled ? "white" : "var(--text-secondary)",
              }}
            >
              <Layers size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="font-bold text-sm sm:text-base flex items-center gap-2 flex-wrap"
                style={{ color: "var(--text-primary)" }}
              >
                Component Customization
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    background: isEnabled ? "#10b98120" : "#f59e0b20",
                    color: isEnabled ? "#10b981" : "#f59e0b",
                  }}
                >
                  {isEnabled ? "Active" : "Disabled"}
                </span>
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {isEnabled
                  ? "Custom component styles are active"
                  : "Site uses original design"}
              </p>
            </div>
          </div>

          <button
            onClick={handleMasterToggle}
            className="relative w-14 h-8 rounded-full transition-all shrink-0 cursor-pointer"
            style={{
              background: isEnabled ? "var(--accent)" : "var(--border)",
            }}
            aria-label="Toggle"
          >
            <div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all flex items-center justify-center"
              style={{
                left: isEnabled ? "calc(100% - 1.75rem)" : "0.25rem",
              }}
            >
              {isEnabled && (
                <Check
                  size={12}
                  style={{ color: "var(--accent)" }}
                  strokeWidth={3}
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Top actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer border-2"
          style={{
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            background: "transparent",
          }}
        >
          <Download size={14} /> Export
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer border-2"
          style={{
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            background: "transparent",
          }}
        >
          <Upload size={14} /> Import
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={() => {
            if (confirm("Reset all component customizations?")) {
              resetComponents();
              toast.success("Reset to original design");
            }
          }}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer ml-auto"
          style={{ color: "#ef4444", background: "#ef444420" }}
        >
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      {/* Component Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-5 overflow-x-auto scrollbar-hide"
        style={{ background: "var(--bg-secondary)" }}
      >
        {componentTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveComponent(tab.key)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0"
            style={{
              background:
                activeComponent === tab.key ? "var(--accent)" : "transparent",
              color:
                activeComponent === tab.key
                  ? "white"
                  : "var(--text-secondary)",
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Component Content */}
      <div
        className="rounded-xl border p-4 sm:p-6"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        {/* ═══════════ NAVBAR ═══════════ */}
        {activeComponent === "navbar" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Navigation size={16} style={{ color: "var(--accent)" }} />
              Navbar Customization
            </h3>

            <FieldRow
              label={`Height: ${localComponents.navbar.height}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="48"
                max="96"
                value={localComponents.navbar.height}
                onChange={(e) =>
                  updateComp("height", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow label="Logo Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.navbar.logoColor}
                onChange={(v) => updateComp("logoColor", v)}
              />
            </FieldRow>

            <FieldRow label="Shadow" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.navbar.shadow}
                onChange={(v) => updateComp("shadow", v)}
                options={["none", "subtle", "medium", "dramatic"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <ToggleRow
              label="Sticky on Top"
              desc="Navbar stays on top when scrolling"
              checked={localComponents.navbar.sticky}
              onChange={(v) => updateComp("sticky", v)}
            />

            <ToggleRow
              label="Bottom Border"
              desc="Show border below navbar"
              checked={localComponents.navbar.borderBottom}
              onChange={(v) => updateComp("borderBottom", v)}
            />
          </div>
        )}

        {/* ═══════════ HERO ═══════════ */}
        {activeComponent === "hero" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Image size={16} style={{ color: "var(--accent)" }} />
              Hero Section
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Gradient From" inputStyle={inputStyle}>
                <ColorInput
                  value={localComponents.hero.gradientFrom}
                  onChange={(v) => updateComp("gradientFrom", v)}
                />
              </FieldRow>
              <FieldRow label="Gradient To" inputStyle={inputStyle}>
                <ColorInput
                  value={localComponents.hero.gradientTo}
                  onChange={(v) => updateComp("gradientTo", v)}
                />
              </FieldRow>
            </div>

            {/* Preview */}
            <div
              className="h-24 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${localComponents.hero.gradientFrom} 0%, ${localComponents.hero.gradientTo} 100%)`,
              }}
            >
              Gradient Preview
            </div>

            <FieldRow label="Text Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.hero.textColor}
                onChange={(v) => updateComp("textColor", v)}
              />
            </FieldRow>

            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Button Background" inputStyle={inputStyle}>
                <ColorInput
                  value={localComponents.hero.buttonBg}
                  onChange={(v) => updateComp("buttonBg", v)}
                />
              </FieldRow>
              <FieldRow label="Button Text" inputStyle={inputStyle}>
                <ColorInput
                  value={localComponents.hero.buttonText}
                  onChange={(v) => updateComp("buttonText", v)}
                />
              </FieldRow>
            </div>

            <FieldRow label="Height" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.hero.height}
                onChange={(v) => updateComp("height", v)}
                options={["small", "medium", "large"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <ToggleRow
              label="Rounded Bottom Corners"
              desc="Rounded corners at bottom of hero"
              checked={localComponents.hero.rounded}
              onChange={(v) => updateComp("rounded", v)}
            />
          </div>
        )}

        {/* ═══════════ PRODUCT CARD ═══════════ */}
        {activeComponent === "productCard" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Package size={16} style={{ color: "var(--accent)" }} />
              Product Card Style
            </h3>

            <FieldRow
              label={`Border Radius: ${localComponents.productCard.borderRadius}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="0"
                max="24"
                value={localComponents.productCard.borderRadius}
                onChange={(e) =>
                  updateComp("borderRadius", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow label="Border Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.productCard.borderColor}
                onChange={(v) => updateComp("borderColor", v)}
              />
            </FieldRow>

            <FieldRow label="Hover Effect" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.productCard.hoverEffect}
                onChange={(v) => updateComp("hoverEffect", v)}
                options={["none", "lift", "scale", "glow"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <FieldRow label="Image Ratio" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.productCard.imageRatio}
                onChange={(v) => updateComp("imageRatio", v)}
                options={["square", "portrait", "landscape"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <FieldRow label="Shadow" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.productCard.shadow}
                onChange={(v) => updateComp("shadow", v)}
                options={["none", "subtle", "medium", "dramatic"]}
                inputStyle={inputStyle}
              />
            </FieldRow>
          </div>
        )}

        {/* ═══════════ BUTTONS ═══════════ */}
        {activeComponent === "buttons" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <MousePointerClick
                size={16}
                style={{ color: "var(--accent)" }}
              />
              Button Styles
            </h3>

            <FieldRow label="Primary Background" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.buttons.primaryBg}
                onChange={(v) => updateComp("primaryBg", v)}
              />
            </FieldRow>

            <FieldRow label="Primary Text" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.buttons.primaryText}
                onChange={(v) => updateComp("primaryText", v)}
              />
            </FieldRow>

            <FieldRow
              label={`Border Radius: ${localComponents.buttons.radius}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="0"
                max="32"
                value={localComponents.buttons.radius}
                onChange={(e) =>
                  updateComp("radius", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow label="Hover Effect" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.buttons.hoverEffect}
                onChange={(v) => updateComp("hoverEffect", v)}
                options={["none", "scale", "darken"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <FieldRow label="Shadow" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.buttons.shadow}
                onChange={(v) => updateComp("shadow", v)}
                options={["none", "subtle", "medium", "dramatic"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <ToggleRow
              label="Uppercase Text"
              desc="All button text in UPPERCASE"
              checked={localComponents.buttons.uppercase}
              onChange={(v) => updateComp("uppercase", v)}
            />
          </div>
        )}

        {/* ═══════════ FOOTER ═══════════ */}
        {activeComponent === "footer" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <AlignJustify size={16} style={{ color: "var(--accent)" }} />
              Footer Style
            </h3>

            <FieldRow label="Background Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.footer.bgLight}
                onChange={(v) => updateComp("bgLight", v)}
              />
            </FieldRow>

            <FieldRow label="Text Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.footer.textLight}
                onChange={(v) => updateComp("textLight", v)}
              />
            </FieldRow>

            <FieldRow label="Columns" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.footer.columns}
                onChange={(v) => updateComp("columns", Number(v))}
                options={[2, 3, 4]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <ToggleRow
              label="Show Social Icons"
              desc="Facebook, Instagram, Twitter"
              checked={localComponents.footer.showSocial}
              onChange={(v) => updateComp("showSocial", v)}
            />

            <ToggleRow
              label="Show Legal Links"
              desc="Terms & Privacy in footer"
              checked={localComponents.footer.showLegalLinks}
              onChange={(v) => updateComp("showLegalLinks", v)}
            />
          </div>
        )}

        {/* ═══════════ FORMS ═══════════ */}
        {activeComponent === "forms" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <FileInput size={16} style={{ color: "var(--accent)" }} />
              Form / Input Styles
            </h3>

            <FieldRow
              label={`Border Radius: ${localComponents.forms.radius}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="0"
                max="24"
                value={localComponents.forms.radius}
                onChange={(e) =>
                  updateComp("radius", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow
              label={`Border Width: ${localComponents.forms.borderWidth}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="0"
                max="4"
                value={localComponents.forms.borderWidth}
                onChange={(e) =>
                  updateComp("borderWidth", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow label="Border Color" inputStyle={inputStyle}>
              <ColorInput
                value={localComponents.forms.borderColor}
                onChange={(v) => updateComp("borderColor", v)}
              />
            </FieldRow>

            <ToggleRow
              label="Focus Ring"
              desc="Highlight border on focus"
              checked={localComponents.forms.focusRing}
              onChange={(v) => updateComp("focusRing", v)}
            />

            {/* Preview */}
            <div className="pt-2">
              <p
                className="text-xs font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Preview
              </p>
              <input
                type="text"
                placeholder="Sample input field..."
                className="w-full px-3 py-2.5 text-sm"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  border: `${localComponents.forms.borderWidth}px solid ${localComponents.forms.borderColor}`,
                  borderRadius: `${localComponents.forms.radius}px`,
                }}
              />
            </div>
          </div>
        )}

        {/* ═══════════ GLOBAL ═══════════ */}
        {activeComponent === "global" && (
          <div className="animate-fadeIn space-y-4">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Globe size={16} style={{ color: "var(--accent)" }} />
              Global Settings
            </h3>

            <FieldRow
              label={`Border Radius: ${localComponents.global.borderRadius}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="0"
                max="30"
                value={localComponents.global.borderRadius}
                onChange={(e) =>
                  updateComp("borderRadius", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow
              label={`Container Width: ${localComponents.global.containerWidth}px`}
              inputStyle={inputStyle}
            >
              <input
                type="range"
                min="960"
                max="1440"
                step="32"
                value={localComponents.global.containerWidth}
                onChange={(e) =>
                  updateComp("containerWidth", Number(e.target.value))
                }
                className="w-full cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
            </FieldRow>

            <FieldRow label="Section Spacing" inputStyle={inputStyle}>
              <SelectInput
                value={localComponents.global.sectionSpacing}
                onChange={(v) => updateComp("sectionSpacing", v)}
                options={["small", "medium", "large"]}
                inputStyle={inputStyle}
              />
            </FieldRow>

            <ToggleRow
              label="Enable Animations"
              desc="Page transitions, fade-ins, etc."
              checked={localComponents.global.animationsEnabled}
              onChange={(v) => updateComp("animationsEnabled", v)}
            />
          </div>
        )}
      </div>

      {/* Tips */}
      <div
        className="mt-5 p-4 rounded-xl border text-xs"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        💡 <strong style={{ color: "var(--text-primary)" }}>Tips:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>
            প্রতিটা component আলাদা tab এ — সব تغییر সেভ হবে automatically
          </li>
          <li>
            <strong>Export</strong> দিয়ে backup নিন
          </li>
          <li>
            <strong>Reset All</strong> দিয়ে original design এ ফিরে যান
          </li>
          <li>
            কোনো পরিবর্তন করলেই Master Switch <strong>auto-enable</strong> হবে
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════ Reusable Components ═══════════ */

function FieldRow({ label, children }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 rounded-lg border cursor-pointer shrink-0"
        style={{ borderColor: "var(--border)" }}
      />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border text-xs font-mono focus:outline-none"
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderColor: "var(--border)",
        }}
      />
    </div>
  );
}

function SelectInput({ value, onChange, options, inputStyle }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none cursor-pointer capitalize"
      style={inputStyle}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {String(o).charAt(0).toUpperCase() + String(o).slice(1)}
        </option>
      ))}
    </select>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div
      className="flex items-center justify-between gap-4 p-3 rounded-lg"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="min-w-0">
        <p
          className="font-semibold text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {desc}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-12 h-7 rounded-full transition-all shrink-0 cursor-pointer"
        style={{
          background: checked ? "var(--accent)" : "var(--border)",
        }}
      >
        <div
          className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all"
          style={{
            left: checked ? "calc(100% - 1.625rem)" : "0.125rem",
          }}
        />
      </button>
    </div>
  );
}