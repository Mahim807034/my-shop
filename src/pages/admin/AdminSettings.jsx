import { useState, useEffect } from "react";
import { Save, RotateCcw, Store } from "lucide-react";
import { useSettings } from "../../store/settingsStore";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    toast.success("Settings saved!");
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      resetSettings();
      toast.success("Settings reset");
    }
  };

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  const fields = [
    { key: "siteName", label: "Website Name", placeholder: "My Shop" },
    {
      key: "tagline",
      label: "Tagline",
      placeholder: "Quality products at affordable prices",
    },
    {
      key: "whatsapp",
      label: "WhatsApp Number",
      placeholder: "8801XXXXXXXXX",
      hint: "Country code সহ, + ছাড়া",
    },
    { key: "phone", label: "Phone", placeholder: "+880 1XXX-XXXXXX" },
    { key: "email", label: "Email", placeholder: "info@myshop.com" },
    { key: "address", label: "Address", placeholder: "Dhaka, Bangladesh" },
    {
      key: "deliveryCharge",
      label: "Delivery Charge (৳)",
      placeholder: "60",
      type: "number",
    },
    { key: "currency", label: "Currency Symbol", placeholder: "৳" },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-5">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </h1>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Manage your website information
        </p>
      </div>

      <div
        className="rounded-xl border p-4 sm:p-6 max-w-2xl"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Store size={20} style={{ color: "var(--accent)" }} />
          <h2
            className="font-bold text-base sm:text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            Store Information
          </h2>
        </div>

        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label
                className="block text-xs sm:text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.label}
              </label>
              <input
                type={f.type || "text"}
                value={form[f.key] || ""}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
                placeholder={f.placeholder}
                className="w-full px-3 sm:px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
                style={inputStyle}
              />
              {f.hint && (
                <p
                  className="text-[10px] sm:text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.hint}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg font-semibold text-white transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-md text-sm"
            style={{ background: "var(--accent)" }}
          >
            <Save size={16} /> Save Changes
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-lg font-semibold border-2 transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
            style={{
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          >
            <RotateCcw size={16} /> Reset Default
          </button>
        </div>
      </div>
    </div>
  );
}