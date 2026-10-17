import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage, LANGUAGES } from "../store/languageStore";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (key) => {
    setLanguage(key);
    setOpen(false);
  };

  if (compact) {
    // Compact — simple toggle button
    return (
      <button
        onClick={() => {
          const next = lang === "en" ? "bn" : "en";
          setLanguage(next);
        }}
        className="p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{ background: "var(--bg-primary)" }}
        aria-label="Switch language"
        title={lang === "en" ? "বাংলা" : "English"}
      >
        <span className="text-lg">{LANGUAGES[lang]?.flag}</span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{ background: "var(--bg-primary)" }}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={16} style={{ color: "var(--text-primary)" }} />
        <span className="text-sm hidden sm:inline">
          {LANGUAGES[lang]?.flag}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg border overflow-hidden animate-scaleIn z-50"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              borderColor: "var(--border)",
            }}
          >
            Language
          </div>
          {Object.entries(LANGUAGES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className="w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 transition-all hover:pl-4 cursor-pointer"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="text-lg">{value.flag}</span>
              <span>{value.name}</span>
              {lang === key && (
                <Check
                  size={14}
                  className="ml-auto"
                  style={{ color: "var(--accent)" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}