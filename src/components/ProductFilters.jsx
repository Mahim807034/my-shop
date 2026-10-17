import { useState, useEffect } from "react";
import { Sliders, X, Check, Star, Package, Tag } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function ProductFilters({
  products = [],
  categories = [],
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  isOpen,
  onClose,
  totalResults = 0,
}) {
  const { t } = useLanguage();
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [priceMax, setPriceMax] = useState(0);

  // 🎯 Translate sort options
  const SORT_OPTIONS = [
    { value: "newest", label: t("newestFirst") },
    { value: "price-low", label: t("priceLowHigh") },
    { value: "price-high", label: t("priceHighLow") },
    { value: "rating", label: t("topRated") },
    { value: "name-asc", label: t("nameAsc") },
    { value: "name-desc", label: t("nameDesc") },
  ];

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => Number(p.price) || 0);
      const max = Math.ceil(Math.max(...prices) / 100) * 100;
      setPriceMax(max);
    }
  }, [products]);

  useEffect(() => {
    if (filters?.priceRange) {
      setPriceRange(filters.priceRange);
    }
  }, [filters?.priceRange]);

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    onFilterChange({ ...filters, priceRange: [min, max] });
  };

  const handleCategoryToggle = (category) => {
    const current = filters?.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleRatingChange = (rating) => {
    const current = filters?.rating || 0;
    const updated = current === rating ? 0 : rating;
    onFilterChange({ ...filters, rating: updated });
  };

  const handleStockToggle = () => {
    onFilterChange({ ...filters, inStockOnly: !filters?.inStockOnly });
  };

  const clearAll = () => {
    setPriceRange([0, priceMax]);
    onFilterChange({
      categories: [],
      priceRange: [0, priceMax],
      rating: 0,
      inStockOnly: false,
    });
  };

  const hasActiveFilters =
    (filters?.categories?.length || 0) > 0 ||
    (filters?.rating || 0) > 0 ||
    filters?.inStockOnly ||
    (filters?.priceRange &&
      (filters.priceRange[0] > 0 || filters.priceRange[1] < priceMax));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-auto w-80 max-w-[85vw] lg:w-full z-50 lg:z-10 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
        }}
        aria-label={t("filters")}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sliders size={18} style={{ color: "var(--accent)" }} />
              <h2
                className="font-bold text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {t("filters")}
              </h2>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                {totalResults}
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg transition hover:scale-110 cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
              aria-label={t("close")}
            >
              <X size={18} />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="w-full mb-4 py-2 rounded-lg font-semibold text-xs transition hover:scale-[1.01] cursor-pointer"
              style={{
                background: "#ef444420",
                color: "#ef4444",
              }}
            >
              {t("clearFilters")}
            </button>
          )}

          {/* Sort */}
          <div className="mb-6">
            <label
              className="block text-xs font-bold mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("sortBy")}
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 cursor-pointer"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border)",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          {priceMax > 0 && (
            <div className="mb-6">
              <label
                className="block text-xs font-bold mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                💰 {t("price") || "Price Range"}
              </label>

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(
                      Math.min(Number(e.target.value), priceRange[1]),
                      priceRange[1]
                    )
                  }
                  min="0"
                  max={priceRange[1]}
                  className="w-full px-2 py-1.5 rounded border text-xs focus:outline-none"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border)",
                  }}
                  aria-label="Minimum price"
                />
                <span style={{ color: "var(--text-secondary)" }}>—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(
                      priceRange[0],
                      Math.max(Number(e.target.value), priceRange[0])
                    )
                  }
                  min={priceRange[0]}
                  max={priceMax}
                  className="w-full px-2 py-1.5 rounded border text-xs focus:outline-none"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border)",
                  }}
                  aria-label="Maximum price"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: `< 500`, min: 0, max: 500 },
                  { label: `500-1000`, min: 500, max: 1000 },
                  { label: `1000-2000`, min: 1000, max: 2000 },
                  { label: `2000+`, min: 2000, max: priceMax },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handlePriceChange(r.min, r.max)}
                    className="py-1.5 px-2 rounded text-xs font-medium transition hover:scale-105 cursor-pointer"
                    style={{
                      background:
                        priceRange[0] === r.min && priceRange[1] === r.max
                          ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                          : "var(--bg-primary)",
                      color:
                        priceRange[0] === r.min && priceRange[1] === r.max
                          ? "white"
                          : "var(--text-primary)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          {categories.length > 0 && (
            <div className="mb-6">
              <label
                className="block text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                <Tag size={11} /> {t("category")}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {categories.map((c) => {
                  const isSelected = (filters?.categories || []).includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => handleCategoryToggle(c)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all hover:pl-4 cursor-pointer"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)"
                          : "transparent",
                        color: "var(--text-primary)",
                      }}
                      aria-pressed={isSelected}
                    >
                      <div
                        className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                        style={{
                          borderColor: isSelected
                            ? "var(--accent)"
                            : "var(--border)",
                          background: isSelected
                            ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <Check
                            size={10}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span className="truncate">{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="mb-6">
            <label
              className="block text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Star size={11} /> {t("reviews")}
            </label>
            <div className="space-y-1.5">
              {[4, 3, 2, 1].map((r) => {
                const isSelected = (filters?.rating || 0) === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRatingChange(r)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all hover:pl-4 cursor-pointer"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)"
                        : "transparent",
                      color: "var(--text-primary)",
                    }}
                    aria-pressed={isSelected}
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= r ? "#f59e0b" : "none"}
                          style={{
                            color: s <= r ? "#f59e0b" : "var(--border)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs"> & up</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <button
              onClick={handleStockToggle}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:pl-4 cursor-pointer"
              style={{
                background: filters?.inStockOnly
                  ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)"
                  : "transparent",
                color: "var(--text-primary)",
              }}
              aria-pressed={filters?.inStockOnly}
            >
              <div
                className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: filters?.inStockOnly
                    ? "var(--accent)"
                    : "var(--border)",
                  background: filters?.inStockOnly
                    ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                    : "transparent",
                }}
              >
                {filters?.inStockOnly && (
                  <Check size={10} className="text-white" strokeWidth={3} />
                )}
              </div>
              <Package size={14} />
              <span>{t("inStock")}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}