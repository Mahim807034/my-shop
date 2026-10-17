import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, Package } from "lucide-react";
import { useProducts } from "../store/productStore";
import { useLanguage } from "../store/languageStore";

export default function SearchBar({
  onClose = null,
  isMobile = false,
  autoFocus = false,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const products = useProducts((s) => s.products);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("shop-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return (
          name.startsWith(q) ||
          name.includes(q) ||
          category.includes(q) ||
          desc.includes(q)
        );
      })
      .sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 6);
  }, [query, products]);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [
      term.trim(),
      ...recentSearches.filter(
        (s) => s.toLowerCase() !== term.trim().toLowerCase()
      ),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("shop-recent-searches", JSON.stringify(updated));
  };

  const handleSelect = (product) => {
    saveRecentSearch(query);
    setQuery("");
    setOpen(false);
    setHighlightedIndex(-1);
    if (onClose) onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSearchAll = () => {
    if (!query.trim()) return;
    saveRecentSearch(query);
    if (onClose) onClose();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex]);
      } else {
        handleSearchAll();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
      if (onClose) onClose();
    }
  };

  const highlightMatch = (text, q) => {
    if (!q.trim()) return text;
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQ})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="px-0.5 rounded"
          style={{
            background: "linear-gradient(135deg, #10b98140, #3b82f640)",
            color: "var(--accent)",
            fontWeight: "700",
          }}
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const showDropdown =
    open && (query.trim() || recentSearches.length > 0);

  return (
    <div className={`relative ${isMobile ? "w-full" : "w-64 lg:w-80"}`}>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-secondary)" }}
        />
        <input          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("search")}
          className="w-full pl-9 pr-8 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 transition"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setHighlightedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition hover:scale-110 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label={t("clear")}
          >
            <X size={14} />
          </button>
        )}
        {!query && onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition hover:scale-110 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            aria-label={t("close")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden z-[100] animate-fadeIn"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {suggestions.length > 0 && (
            <>
              <div
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-primary)",
                }}
              >
                <Package size={11} />
                {t("products")} ({suggestions.length})
              </div>
              {suggestions.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className="w-full flex items-center gap-3 p-2.5 transition-all cursor-pointer text-left"
                  style={{
                    background:
                      highlightedIndex === i
                        ? "var(--bg-primary)"
                        : "transparent",
                    borderLeft:
                      highlightedIndex === i
                        ? "3px solid var(--accent)"
                        : "3px solid transparent",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border"
                    style={{ borderColor: "var(--border)" }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/60x60?text=?";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {highlightMatch(p.name, query)}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {p.category}
                    </p>
                  </div>
                </button>
              ))}

              <button
                onClick={handleSearchAll}
                className="w-full p-3 text-center text-sm font-semibold transition-all border-t hover:scale-[1.01] cursor-pointer"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--accent)",
                  borderColor: "var(--border)",
                }}
              >
                🔍 "{query}"
              </button>
            </>
          )}

          {query.trim() && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <Search
                size={32}
                className="mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t("noProductsFound")}
              </p>
            </div>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <>
              <div
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-primary)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {t("featuredHighlights") || "Recent"}
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("shop-recent-searches");
                  }}
                  className="text-[10px] hover:underline cursor-pointer"
                  style={{ color: "var(--accent)" }}
                >
                  {t("clear")}
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    setOpen(true);
                  }}
                  className="w-full px-3 py-2.5 flex items-center gap-3 transition-all cursor-pointer text-left"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Clock size={14} style={{ color: "var(--text-secondary)" }} />
                  <span className="text-sm">{term}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}