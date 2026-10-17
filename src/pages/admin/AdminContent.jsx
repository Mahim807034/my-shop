import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Navigation,
  Image,
  Sparkles,
  Package,
  Info,
  AlignJustify,
  Megaphone,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useSiteContent } from "../../store/siteContentStore";
import toast from "react-hot-toast";

const SECTIONS = [
  { key: "global", label: "Global", icon: Layout },
  { key: "announcement", label: "Announcement", icon: Megaphone },
  { key: "navbar", label: "Navbar", icon: Navigation },
  { key: "hero", label: "Hero", icon: Image },
  { key: "features", label: "Features", icon: Sparkles },
  { key: "featuredProducts", label: "Featured", icon: Package },
  { key: "aboutSection", label: "About", icon: Info },
  { key: "cta", label: "CTA", icon: Sparkles },
  { key: "footer", label: "Footer", icon: AlignJustify },
];

export default function AdminContent() {
  const {
    draft,
    updateDraft,
    save,
    discard,
    resetSection,
    resetAll,
    exportContent,
    importContent,
    hasChanges,
    init,
  } = useSiteContent();

  const [activeSection, setActiveSection] = useState("global");
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const importRef = useRef(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    setHasUnsaved(hasChanges());
  }, [draft, hasChanges]);

  useEffect(() => {
    const handler = (e) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleUpdate = (section, key, value) => {
    updateDraft(section, { [key]: value });
  };

  const handleSave = () => {
    const res = save();
    if (res.success) {
      toast.success("Changes saved and applied!", {
        icon: "✅",
        duration: 2000,
      });
    }
  };

  const handleDiscard = () => {
    if (
      confirm(
        "Discard all unsaved changes? This will revert to the last saved version."
      )
    ) {
      discard();
      toast.success("Changes discarded");
    }
  };

  const handleResetSection = () => {
    if (
      confirm(
        `Reset "${activeSection}" section to default? Click Save after to apply.`
      )
    ) {
      resetSection(activeSection);
      toast.success(`${activeSection} reset to default`);
    }
  };

  const handleExport = () => {
    const json = exportContent();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = importContent(ev.target.result);
      if (res.success) {
        toast.success("Imported and saved!");
      } else {
        toast.error(res.error);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div className="animate-fadeIn pb-32 sm:pb-28">
      <div className="mb-5">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Website Content
        </h1>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Edit text, images, links — press{" "}
          <strong style={{ color: "var(--accent)" }}>Save</strong> to apply
        </p>
      </div>

      {hasUnsaved && (
        <div
          className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs animate-fadeIn"
          style={{
            background: "#f59e0b15",
            border: "1px solid #f59e0b60",
            color: "#f59e0b",
          }}
        >
          <AlertCircle size={14} className="shrink-0" />
          <span>
            <strong>Unsaved changes</strong> — Save button চাপুন
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={handleSave}
          disabled={!hasUnsaved}
          className="px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <Save size={14} /> Save Changes
        </button>

        <button
          onClick={handleDiscard}
          disabled={!hasUnsaved}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer border-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            background: "transparent",
          }}
        >
          <X size={14} /> Discard
        </button>

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
          onClick={handleResetSection}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer border-2"
          style={{
            color: "#f59e0b",
            borderColor: "#f59e0b",
            background: "transparent",
          }}
        >
          <RotateCcw size={14} /> Reset Section
        </button>

        <button
          onClick={() => {
            if (confirm("Reset ALL content to default?")) {
              resetAll();
              toast.success("Reset all content");
            }
          }}
          className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer ml-auto"
          style={{ color: "#ef4444", background: "#ef444420" }}
        >
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      {/* Section Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-5 overflow-x-auto scrollbar-hide"
        style={{ background: "var(--bg-secondary)" }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0"
            style={{
              background:
                activeSection === s.key ? "var(--accent)" : "transparent",
              color:
                activeSection === s.key ? "white" : "var(--text-secondary)",
            }}
          >
            <s.icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="rounded-xl border p-4 sm:p-6 space-y-4"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        {/* ═══════ GLOBAL ═══════ */}
        {activeSection === "global" && (
          <div className="space-y-4 animate-fadeIn">
            <Input
              label="Site Name"
              value={draft.global?.siteName || ""}
              onChange={(v) => handleUpdate("global", "siteName", v)}
              inputStyle={inputStyle}
            />
            <Input
              label="Tagline"
              value={draft.global?.tagline || ""}
              onChange={(v) => handleUpdate("global", "tagline", v)}
              inputStyle={inputStyle}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Currency Symbol"
                value={draft.global?.currency || ""}
                onChange={(v) => handleUpdate("global", "currency", v)}
                inputStyle={inputStyle}
              />
              <Input
                label="Delivery Charge"
                type="number"
                value={draft.global?.deliveryCharge || 0}
                onChange={(v) =>
                  handleUpdate("global", "deliveryCharge", Number(v))
                }
                inputStyle={inputStyle}
              />
            </div>
            <Input
              label="WhatsApp Number"
              value={draft.global?.whatsapp || ""}
              onChange={(v) => handleUpdate("global", "whatsapp", v)}
              hint="Country code সহ, + ছাড়া"
              inputStyle={inputStyle}
            />
          </div>
        )}

        {/* ═══════ ANNOUNCEMENT ═══════ */}
        {activeSection === "announcement" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable Announcement Bar"
              desc="Show a bar at the top of the site"
              checked={draft.announcement?.enabled || false}
              onChange={(v) => handleUpdate("announcement", "enabled", v)}
            />
            <Input
              label="Announcement Text"
              value={draft.announcement?.text || ""}
              onChange={(v) => handleUpdate("announcement", "text", v)}
              inputStyle={inputStyle}
            />
            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Background"
                value={draft.announcement?.bgColor || "#1e293b"}
                onChange={(v) => handleUpdate("announcement", "bgColor", v)}
              />
              <ColorInput
                label="Text Color"
                value={draft.announcement?.textColor || "#ffffff"}
                onChange={(v) =>
                  handleUpdate("announcement", "textColor", v)
                }
              />
            </div>
            <Toggle
              label="Closable"
              desc="Allow users to close the bar"
              checked={draft.announcement?.closable || false}
              onChange={(v) => handleUpdate("announcement", "closable", v)}
            />

            <div className="pt-2">
              <p
                className="text-xs font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Preview
              </p>
              <div
                className="relative py-2.5 px-4 rounded-lg text-center text-xs font-medium"
                style={{
                  background: draft.announcement?.bgColor || "#1e293b",
                  color: draft.announcement?.textColor || "#ffffff",
                }}
              >
                {draft.announcement?.text || "Announcement text here"}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ NAVBAR — Full Customization ═══════ */}
        {activeSection === "navbar" && (
          <div className="space-y-4 animate-fadeIn">
            <h3
              className="font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <Navigation size={16} style={{ color: "var(--accent)" }} />
              Navbar Customization
            </h3>

            {/* Logo */}
            <Input
              label="Logo Text"
              value={draft.navbar?.logoText || ""}
              onChange={(v) => handleUpdate("navbar", "logoText", v)}
              inputStyle={inputStyle}
            />
            <ImageUpload
              label="Logo Image (optional)"
              value={draft.navbar?.logoImage || ""}
              onChange={(v) => handleUpdate("navbar", "logoImage", v)}
            />
            <Toggle
              label="Use Logo Image"
              desc="Show image instead of text"
              checked={draft.navbar?.showLogoImage || false}
              onChange={(v) => handleUpdate("navbar", "showLogoImage", v)}
            />

            {/* ═══ APPEARANCE ═══ */}
            <div
              className="pt-3 border-t space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                🎨 Appearance
              </p>

              {/* Height */}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Height: {draft.navbar?.height || 64}px
                </label>
                <input
                  type="range"
                  min="48"
                  max="96"
                  value={draft.navbar?.height || 64}
                  onChange={(e) =>
                    handleUpdate("navbar", "height", Number(e.target.value))
                  }
                  className="w-full cursor-pointer"
                  style={{ accentColor: "var(--accent)" }}
                />
              </div>

              {/* Background Colors */}
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Background (Light)"
                  value={draft.navbar?.bgColorLight || "#ffffff"}
                  onChange={(v) =>
                    handleUpdate("navbar", "bgColorLight", v)
                  }
                />
                <ColorInput
                  label="Background (Dark)"
                  value={draft.navbar?.bgColorDark || "#171717"}
                  onChange={(v) =>
                    handleUpdate("navbar", "bgColorDark", v)
                  }
                />
              </div>

              {/* Text Colors */}
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Text (Light)"
                  value={draft.navbar?.textColorLight || "#1e293b"}
                  onChange={(v) =>
                    handleUpdate("navbar", "textColorLight", v)
                  }
                />
                <ColorInput
                  label="Text (Dark)"
                  value={draft.navbar?.textColorDark || "#f5f5f5"}
                  onChange={(v) =>
                    handleUpdate("navbar", "textColorDark", v)
                  }
                />
              </div>

              {/* Logo Color */}
              <ColorInput
                label="Logo Color"
                value={draft.navbar?.logoColor || "#eab308"}
                onChange={(v) => handleUpdate("navbar", "logoColor", v)}
              />

              {/* Shadow */}
              <Select
                label="Shadow"
                value={draft.navbar?.shadow || "subtle"}
                onChange={(v) => handleUpdate("navbar", "shadow", v)}
                options={["none", "subtle", "medium", "dramatic"]}
                inputStyle={inputStyle}
              />

              {/* Toggles */}
              <Toggle
                label="Sticky on Scroll"
                desc="Navbar stays on top when scrolling"
                checked={draft.navbar?.sticky !== false}
                onChange={(v) => handleUpdate("navbar", "sticky", v)}
              />
              <Toggle
                label="Bottom Border"
                desc="Show subtle border below navbar"
                checked={draft.navbar?.borderBottom !== false}
                onChange={(v) => handleUpdate("navbar", "borderBottom", v)}
              />
              <Toggle
                label="Blur Backdrop"
                desc="Frosted glass effect on scroll"
                checked={draft.navbar?.blur !== false}
                onChange={(v) => handleUpdate("navbar", "blur", v)}
              />
            </div>

            {/* Menu Items */}
            <div
              className="p-3 rounded-lg space-y-3"
              style={{ background: "var(--bg-primary)" }}
            >
              <p
                className="text-xs font-bold flex items-center justify-between"
                style={{ color: "var(--text-primary)" }}
              >
                Menu Items
                <button
                  onClick={() => {
                    const newItems = [
                      ...(draft.navbar?.menuItems || []),
                      { label: "New", to: "/" },
                    ];
                    handleUpdate("navbar", "menuItems", newItems);
                  }}
                  className="text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Plus size={10} /> Add
                </button>
              </p>
              {(draft.navbar?.menuItems || []).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...draft.navbar.menuItems];
                      newItems[i] = { ...item, label: e.target.value };
                      handleUpdate("navbar", "menuItems", newItems);
                    }}
                    placeholder="Label"
                    className="flex-1 px-2 py-1.5 rounded border text-xs"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={item.to}
                    onChange={(e) => {
                      const newItems = [...draft.navbar.menuItems];
                      newItems[i] = { ...item, to: e.target.value };
                      handleUpdate("navbar", "menuItems", newItems);
                    }}
                    placeholder="/link"
                    className="flex-1 px-2 py-1.5 rounded border text-xs"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => {
                      const newItems = draft.navbar.menuItems.filter(
                        (_, idx) => idx !== i
                      );
                      handleUpdate("navbar", "menuItems", newItems);
                    }}
                    className="p-1.5 rounded cursor-pointer hover:scale-110"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Icons */}
            <Toggle
              label="Show Wishlist Icon"
              checked={draft.navbar?.showWishlist !== false}
              onChange={(v) => handleUpdate("navbar", "showWishlist", v)}
            />
            <Toggle
              label="Show Cart Icon"
              checked={draft.navbar?.showCart !== false}
              onChange={(v) => handleUpdate("navbar", "showCart", v)}
            />
          </div>
        )}

        {/* ═══════ HERO ═══════ */}
        {activeSection === "hero" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable Hero Section"
              checked={draft.hero?.enabled || false}
              onChange={(v) => handleUpdate("hero", "enabled", v)}
            />
            <Input
              label="Hero Title"
              value={draft.hero?.title || ""}
              onChange={(v) => handleUpdate("hero", "title", v)}
              inputStyle={inputStyle}
            />
            <Textarea
              label="Subtitle"
              value={draft.hero?.subtitle || ""}
              onChange={(v) => handleUpdate("hero", "subtitle", v)}
              inputStyle={inputStyle}
            />

            <Select
              label="Background Type"
              value={draft.hero?.bgType || "gradient"}
              onChange={(v) => handleUpdate("hero", "bgType", v)}
              options={["gradient", "solid", "image"]}
              inputStyle={inputStyle}
            />

            {draft.hero?.bgType === "gradient" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <ColorInput
                    label="Gradient From"
                    value={draft.hero?.gradientFrom || "#eab308"}
                    onChange={(v) =>
                      handleUpdate("hero", "gradientFrom", v)
                    }
                  />
                  <ColorInput
                    label="Gradient To"
                    value={draft.hero?.gradientTo || "#ca8a04"}
                    onChange={(v) => handleUpdate("hero", "gradientTo", v)}
                  />
                </div>
              </>
            )}

            {draft.hero?.bgType === "solid" && (
              <ColorInput
                label="Background Color"
                value={draft.hero?.solidColor || "#eab308"}
                onChange={(v) => handleUpdate("hero", "solidColor", v)}
              />
            )}

            {draft.hero?.bgType === "image" && (
              <>
                <ImageUpload
                  label="🖼️ Background Image"
                  value={draft.hero?.bgImage || ""}
                  onChange={(v) => handleUpdate("hero", "bgImage", v)}
                  hint="1920x1080px বা বড়"
                />

                {draft.hero?.bgImage && (
                  <ImageAdjustments
                    values={draft.hero}
                    onChange={(key, value) =>
                      handleUpdate("hero", key, value)
                    }
                    inputStyle={inputStyle}
                    previewImage={draft.hero.bgImage}
                  />
                )}
              </>
            )}

            {draft.hero?.bgType !== "image" && (
              <>
                <ImageUpload
                  label="🎯 Side Image (Optional)"
                  value={draft.hero?.image || ""}
                  onChange={(v) => handleUpdate("hero", "image", v)}
                />
                {draft.hero?.image && (
                  <Select
                    label="Side Image Position"
                    value={draft.hero?.imagePosition || "right"}
                    onChange={(v) =>
                      handleUpdate("hero", "imagePosition", v)
                    }
                    options={["right", "left"]}
                    inputStyle={inputStyle}
                  />
                )}
              </>
            )}

            <ColorInput
              label="Text Color"
              value={draft.hero?.textColor || "#ffffff"}
              onChange={(v) => handleUpdate("hero", "textColor", v)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Height"
                value={draft.hero?.height || "medium"}
                onChange={(v) => handleUpdate("hero", "height", v)}
                options={["small", "medium", "large"]}
                inputStyle={inputStyle}
              />
              <Select
                label="Text Alignment"
                value={draft.hero?.alignment || "center"}
                onChange={(v) => handleUpdate("hero", "alignment", v)}
                options={["center", "left", "right"]}
                inputStyle={inputStyle}
              />
            </div>

            <div
              className="p-3 rounded-lg space-y-3"
              style={{ background: "var(--bg-primary)" }}
            >
              <p
                className="text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Primary Button
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Text"
                  value={draft.hero?.buttonPrimary?.text || ""}
                  onChange={(v) =>
                    handleUpdate("hero", "buttonPrimary", {
                      ...(draft.hero?.buttonPrimary || {}),
                      text: v,
                    })
                  }
                  inputStyle={inputStyle}
                />
                <Input
                  label="Link"
                  value={draft.hero?.buttonPrimary?.to || ""}
                  onChange={(v) =>
                    handleUpdate("hero", "buttonPrimary", {
                      ...(draft.hero?.buttonPrimary || {}),
                      to: v,
                    })
                  }
                  inputStyle={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ColorInput
                  label="Background"
                  value={draft.hero?.buttonPrimary?.bgColor || "#ffffff"}
                  onChange={(v) =>
                    handleUpdate("hero", "buttonPrimary", {
                      ...(draft.hero?.buttonPrimary || {}),
                      bgColor: v,
                    })
                  }
                />
                <ColorInput
                  label="Text Color"
                  value={draft.hero?.buttonPrimary?.textColor || "#1e293b"}
                  onChange={(v) =>
                    handleUpdate("hero", "buttonPrimary", {
                      ...(draft.hero?.buttonPrimary || {}),
                      textColor: v,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════ FEATURES ═══════ */}
        {activeSection === "features" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable Features Section"
              checked={draft.features?.enabled || false}
              onChange={(v) => handleUpdate("features", "enabled", v)}
            />
            <Input
              label="Section Title"
              value={draft.features?.title || ""}
              onChange={(v) => handleUpdate("features", "title", v)}
              inputStyle={inputStyle}
            />

            <div
              className="p-3 rounded-lg space-y-3"
              style={{ background: "var(--bg-primary)" }}
            >
              <p
                className="text-xs font-bold flex items-center justify-between"
                style={{ color: "var(--text-primary)" }}
              >
                Feature Cards
                <button
                  onClick={() => {
                    const newItems = [
                      ...(draft.features?.items || []),
                      { icon: "⭐", title: "New Feature", desc: "Description" },
                    ];
                    handleUpdate("features", "items", newItems);
                  }}
                  className="text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Plus size={10} /> Add
                </button>
              </p>
              {(draft.features?.items || []).map((item, i) => (
                <div
                  key={i}
                  className="p-2 rounded border space-y-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.icon}
                      onChange={(e) => {
                        const newItems = [...draft.features.items];
                        newItems[i] = { ...item, icon: e.target.value };
                        handleUpdate("features", "items", newItems);
                      }}
                      placeholder="🎯"
                      maxLength={2}
                      className="w-12 px-2 py-1 rounded border text-center text-lg"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...draft.features.items];
                        newItems[i] = { ...item, title: e.target.value };
                        handleUpdate("features", "items", newItems);
                      }}
                      placeholder="Title"
                      className="flex-1 px-2 py-1 rounded border text-xs"
                      style={inputStyle}
                    />
                    <button
                      onClick={() => {
                        const newItems = draft.features.items.filter(
                          (_, idx) => idx !== i
                        );
                        handleUpdate("features", "items", newItems);
                      }}
                      className="p-1 rounded cursor-pointer hover:scale-110"
                      style={{ color: "#ef4444" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => {
                      const newItems = [...draft.features.items];
                      newItems[i] = { ...item, desc: e.target.value };
                      handleUpdate("features", "items", newItems);
                    }}
                    placeholder="Short description"
                    className="w-full px-2 py-1 rounded border text-xs"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ FEATURED PRODUCTS ═══════ */}
        {activeSection === "featuredProducts" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable Featured Section"
              checked={draft.featuredProducts?.enabled || false}
              onChange={(v) =>
                handleUpdate("featuredProducts", "enabled", v)
              }
            />
            <Input
              label="Section Title"
              value={draft.featuredProducts?.title || ""}
              onChange={(v) =>
                handleUpdate("featuredProducts", "title", v)
              }
              inputStyle={inputStyle}
            />
            <Input
              label="Number of Products"
              type="number"
              value={draft.featuredProducts?.count || 4}
              onChange={(v) =>
                handleUpdate("featuredProducts", "count", Number(v))
              }
              inputStyle={inputStyle}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="View All Text"
                value={draft.featuredProducts?.viewAllText || ""}
                onChange={(v) =>
                  handleUpdate("featuredProducts", "viewAllText", v)
                }
                inputStyle={inputStyle}
              />
              <Input
                label="View All Link"
                value={draft.featuredProducts?.viewAllLink || ""}
                onChange={(v) =>
                  handleUpdate("featuredProducts", "viewAllLink", v)
                }
                inputStyle={inputStyle}
              />
            </div>
          </div>
        )}

        {/* ═══════ ABOUT — Full Background ═══════ */}
        {activeSection === "aboutSection" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable About Section"
              checked={draft.aboutSection?.enabled || false}
              onChange={(v) => handleUpdate("aboutSection", "enabled", v)}
            />
            <Input
              label="Title"
              value={draft.aboutSection?.title || ""}
              onChange={(v) => handleUpdate("aboutSection", "title", v)}
              inputStyle={inputStyle}
            />
            <Textarea
              label="Description"
              value={draft.aboutSection?.description || ""}
              onChange={(v) =>
                handleUpdate("aboutSection", "description", v)
              }
              rows={4}
              inputStyle={inputStyle}
            />

            <Select
              label="Background Type"
              value={draft.aboutSection?.bgType || "solid"}
              onChange={(v) => handleUpdate("aboutSection", "bgType", v)}
              options={["solid", "gradient", "image"]}
              inputStyle={inputStyle}
            />

            {draft.aboutSection?.bgType === "solid" && (
              <ColorInput
                label="Background Color"
                value={draft.aboutSection?.solidColor || "#ffffff"}
                onChange={(v) =>
                  handleUpdate("aboutSection", "solidColor", v)
                }
              />
            )}

            {draft.aboutSection?.bgType === "gradient" && (
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Gradient From"
                  value={draft.aboutSection?.gradientFrom || "#eab308"}
                  onChange={(v) =>
                    handleUpdate("aboutSection", "gradientFrom", v)
                  }
                />
                <ColorInput
                  label="Gradient To"
                  value={draft.aboutSection?.gradientTo || "#ca8a04"}
                  onChange={(v) =>
                    handleUpdate("aboutSection", "gradientTo", v)
                  }
                />
              </div>
            )}

            {draft.aboutSection?.bgType === "image" && (
              <>
                <ImageUpload
                  label="🖼️ Background Image"
                  value={draft.aboutSection?.bgImage || ""}
                  onChange={(v) =>
                    handleUpdate("aboutSection", "bgImage", v)
                  }
                  hint="1920x1080px বা বড়"
                />

                {draft.aboutSection?.bgImage && (
                  <ImageAdjustments
                    values={draft.aboutSection}
                    onChange={(key, value) =>
                      handleUpdate("aboutSection", key, value)
                    }
                    inputStyle={inputStyle}
                    previewImage={draft.aboutSection.bgImage}
                  />
                )}
              </>
            )}

            <ColorInput
              label="Text Color"
              value={draft.aboutSection?.textColorCustom || "#ffffff"}
              onChange={(v) =>
                handleUpdate("aboutSection", "textColorCustom", v)
              }
            />

            {/* Stats */}
            <div
              className="p-3 rounded-lg space-y-3"
              style={{ background: "var(--bg-primary)" }}
            >
              <p
                className="text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Stats
              </p>
              {(draft.aboutSection?.stats || []).map((stat, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...draft.aboutSection.stats];
                      stats[i] = { ...stat, value: e.target.value };
                      handleUpdate("aboutSection", "stats", stats);
                    }}
                    placeholder="10K+"
                    className="w-20 px-2 py-1 rounded border text-xs font-bold text-center"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...draft.aboutSection.stats];
                      stats[i] = { ...stat, label: e.target.value };
                      handleUpdate("aboutSection", "stats", stats);
                    }}
                    placeholder="Label"
                    className="flex-1 px-2 py-1 rounded border text-xs"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ CTA ═══════ */}
        {activeSection === "cta" && (
          <div className="space-y-4 animate-fadeIn">
            <Toggle
              label="Enable CTA Section"
              checked={draft.cta?.enabled || false}
              onChange={(v) => handleUpdate("cta", "enabled", v)}
            />
            <Input
              label="Title"
              value={draft.cta?.title || ""}
              onChange={(v) => handleUpdate("cta", "title", v)}
              inputStyle={inputStyle}
            />
            <Textarea
              label="Subtitle"
              value={draft.cta?.subtitle || ""}
              onChange={(v) => handleUpdate("cta", "subtitle", v)}
              inputStyle={inputStyle}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Button Text"
                value={draft.cta?.buttonText || ""}
                onChange={(v) => handleUpdate("cta", "buttonText", v)}
                inputStyle={inputStyle}
              />
              <Input
                label="Button Link"
                value={draft.cta?.buttonLink || ""}
                onChange={(v) => handleUpdate("cta", "buttonLink", v)}
                inputStyle={inputStyle}
              />
            </div>
          </div>
        )}

        {/* ═══════ FOOTER ═══════ */}
        {activeSection === "footer" && (
          <div className="space-y-4 animate-fadeIn">
            <Textarea
              label="Footer Description"
              value={draft.footer?.description || ""}
              onChange={(v) => handleUpdate("footer", "description", v)}
              inputStyle={inputStyle}
            />

            <div
              className="p-3 rounded-lg space-y-2"
              style={{ background: "var(--bg-primary)" }}
            >
              <p
                className="text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Social Links
              </p>
              {[
                "facebook",
                "instagram",
                "twitter",
                "youtube",
                "whatsapp",
              ].map((social) => (
                <div key={social} className="flex gap-2 items-center">
                  <span
                    className="text-xs w-20 capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {social}
                  </span>
                  <input
                    type="url"
                    value={draft.footer?.social?.[social] || ""}
                    onChange={(e) => {
                      const newSocial = {
                        ...(draft.footer?.social || {}),
                        [social]: e.target.value,
                      };
                      handleUpdate("footer", "social", newSocial);
                    }}
                    placeholder="https://..."
                    className="flex-1 px-2 py-1.5 rounded border text-xs"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            <Input
              label="Copyright Text"
              value={draft.footer?.copyright || ""}
              onChange={(v) => handleUpdate("footer", "copyright", v)}
              inputStyle={inputStyle}
            />
            <Input
              label="Credit Text"
              value={draft.footer?.creditText || ""}
              onChange={(v) => handleUpdate("footer", "creditText", v)}
              inputStyle={inputStyle}
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
        💡{" "}
        <strong style={{ color: "var(--text-primary)" }}>How it works:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>যা যা change করবেন — সেটা draft এ save হবে</li>
          <li>
            Live site এ apply করতে{" "}
            <strong style={{ color: "var(--accent)" }}>Save Changes</strong>{" "}
            button চাপুন
          </li>
          <li>
            ভুল হলে <strong>Discard</strong> — সব আগের অবস্থায় ফিরে যাবে
          </li>
        </ul>
      </div>

      {/* Sticky Save Bar */}
      {hasUnsaved && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-slideIn lg:pl-64"
          style={{
            background: "var(--bg-secondary)",
            borderTop: "2px solid var(--accent)",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle
                size={16}
                style={{ color: "var(--accent)" }}
                className="shrink-0"
              />
              <p
                className="text-xs sm:text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                You have unsaved changes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm border-2 transition hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                  background: "transparent",
                }}
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                style={{ background: "var(--accent)", color: "white" }}
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════ Image Adjustments Component (Reusable) ═══════════ */
function ImageAdjustments({ values, onChange, inputStyle, previewImage }) {
  return (
    <div
      className="p-4 rounded-lg space-y-4 border-2"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-xs font-bold flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <Image size={14} style={{ color: "var(--accent)" }} />
        🎨 Image Adjustments
      </p>

      {/* Position */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Image Position
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { v: "center", l: "Center" },
            { v: "top", l: "Top" },
            { v: "bottom", l: "Bottom" },
            { v: "left", l: "Left" },
            { v: "right", l: "Right" },
            { v: "top left", l: "↖" },
          ].map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => onChange("bgImagePosition", opt.v)}
              className="py-1.5 px-2 rounded text-xs font-medium transition-all hover:scale-105 cursor-pointer"
              style={{
                background:
                  (values?.bgImagePosition || "center") === opt.v
                    ? "var(--accent)"
                    : "var(--bg-secondary)",
                color:
                  (values?.bgImagePosition || "center") === opt.v
                    ? "white"
                    : "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <Select
        label="Image Size"
        value={values?.bgImageSize || "cover"}
        onChange={(v) => onChange("bgImageSize", v)}
        options={["cover", "contain", "auto", "100% 100%"]}
        inputStyle={inputStyle}
      />

      <Select
        label="Image Repeat"
        value={values?.bgImageRepeat || "no-repeat"}
        onChange={(v) => onChange("bgImageRepeat", v)}
        options={["no-repeat", "repeat", "repeat-x", "repeat-y"]}
        inputStyle={inputStyle}
      />

      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Image Opacity: {Math.round((values?.bgImageOpacity ?? 1) * 100)}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={Math.round((values?.bgImageOpacity ?? 1) * 100)}
          onChange={(e) =>
            onChange("bgImageOpacity", Number(e.target.value) / 100)
          }
          className="w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Image Blur: {values?.bgImageBlur || 0}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={values?.bgImageBlur || 0}
          onChange={(e) => onChange("bgImageBlur", Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Image Brightness:{" "}
          {Math.round((values?.bgImageBrightness ?? 1) * 100)}%
        </label>
        <input
          type="range"
          min="30"
          max="150"
          step="5"
          value={Math.round((values?.bgImageBrightness ?? 1) * 100)}
          onChange={(e) =>
            onChange("bgImageBrightness", Number(e.target.value) / 100)
          }
          className="w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Custom Min Height: {values?.customMinHeight || 0}px (0 = auto)
        </label>
        <input
          type="range"
          min="0"
          max="900"
          step="20"
          value={values?.customMinHeight || 0}
          onChange={(e) =>
            onChange("customMinHeight", Number(e.target.value))
          }
          className="w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>

      {/* Overlay */}
      <div
        className="pt-3 border-t space-y-3"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-xs font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          🌑 Overlay Settings
        </p>

        <ColorInput
          label="Overlay Color"
          value={values?.overlayColor || "#000000"}
          onChange={(v) => onChange("overlayColor", v)}
        />

        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Overlay Opacity:{" "}
            {Math.round((values?.overlayOpacity ?? 0.5) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={Math.round((values?.overlayOpacity ?? 0.5) * 100)}
            onChange={(e) =>
              onChange("overlayOpacity", Number(e.target.value) / 100)
            }
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--accent)" }}
          />
        </div>

        <Toggle
          label="Gradient Overlay"
          desc="Solid এর বদলে gradient overlay"
          checked={values?.overlayGradient || false}
          onChange={(v) => onChange("overlayGradient", v)}
        />

        {values?.overlayGradient && (
          <>
            <ColorInput
              label="Gradient From"
              value={values?.overlayGradientFrom || "#000000"}
              onChange={(v) => onChange("overlayGradientFrom", v)}
            />
            <ColorInput
              label="Gradient To"
              value={values?.overlayGradientTo || "transparent"}
              onChange={(v) => onChange("overlayGradientTo", v)}
            />
            <Select
              label="Direction"
              value={values?.overlayGradientDirection || "to-top"}
              onChange={(v) => onChange("overlayGradientDirection", v)}
              options={["to-top", "to-bottom", "to-left", "to-right"]}
              inputStyle={inputStyle}
            />
          </>
        )}
      </div>

      {/* Preview */}
      {previewImage && (
        <div>
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Live Preview
          </p>
          <div
            className="relative rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              height: "160px",
              backgroundImage: `url(${previewImage})`,
              backgroundPosition: values?.bgImagePosition || "center",
              backgroundSize: values?.bgImageSize || "cover",
              backgroundRepeat: values?.bgImageRepeat || "no-repeat",
              filter: `brightness(${values?.bgImageBrightness ?? 1}) blur(${
                values?.bgImageBlur || 0
              }px)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: values?.overlayGradient
                  ? `linear-gradient(${
                      values?.overlayGradientDirection === "to-top"
                        ? "0deg"
                        : values?.overlayGradientDirection === "to-bottom"
                        ? "180deg"
                        : values?.overlayGradientDirection === "to-left"
                        ? "270deg"
                        : "90deg"
                    }, ${values?.overlayGradientFrom || "#000000"}, ${
                      values?.overlayGradientTo || "transparent"
                    })`
                  : `${values?.overlayColor || "#000000"}${Math.round(
                      (values?.overlayOpacity ?? 0.5) * 255
                    )
                      .toString(16)
                      .padStart(2, "0")}`,
              }}
            />
            <p className="relative z-10 text-white text-sm font-bold drop-shadow-md">
              Preview Text
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════ Reusable Components ═══════════ */

function Input({ label, value, onChange, type = "text", hint, inputStyle }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
        style={inputStyle}
      />
      {hint && (
        <p
          className="text-[10px] mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, inputStyle }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
        style={inputStyle}
      />
    </div>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
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
    </div>
  );
}

function Select({ label, value, onChange, options, inputStyle }) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
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
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
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
        {desc && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {desc}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-12 h-7 rounded-full transition-all shrink-0 cursor-pointer"
        style={{ background: checked ? "var(--accent)" : "var(--border)" }}
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

function ImageUpload({ label, value, onChange, hint }) {
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>

      {value ? (
        <div
          className="relative rounded-lg overflow-hidden border"
          style={{ borderColor: "var(--border)" }}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x200?text=Invalid";
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-semibold cursor-pointer hover:scale-105"
            >
              Change
            </button>
            <button
              onClick={() => onChange("")}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold cursor-pointer hover:scale-105"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="w-full h-24 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <Upload size={18} />
          <span className="text-xs">Click to upload image</span>
        </div>
      )}

      {hint && (
        <p
          className="text-[10px] mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {hint}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}