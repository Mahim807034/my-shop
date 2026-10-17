import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X, SlidersHorizontal, LayoutGrid } from "lucide-react";
import { useProducts } from "../store/productStore";
import { useReviews } from "../store/reviewStore";
import { useLanguage } from "../store/languageStore";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductFilters from "../components/ProductFilters";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const products = useProducts((s) => s.products);
  const allReviews = useReviews((s) => s.reviews);
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(urlSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 999999],
    rating: 0,
    inStockOnly: false,
  });

  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(urlSearch);
    setDebouncedQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(q) || category.includes(q) || desc.includes(q);
      });
    }

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    list = list.filter(
      (p) =>
        Number(p.price) >= filters.priceRange[0] &&
        Number(p.price) <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      list = list.filter((p) => {
        const reviews = allReviews[p.id] || [];
        if (reviews.length === 0) return false;
        const avg =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        return avg >= filters.rating;
      });
    }

    if (filters.inStockOnly) {
      list = list.filter((p) => p.stock !== 0);
    }

    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        list.sort((a, b) => {
          const aR = allReviews[a.id] || [];
          const bR = allReviews[b.id] || [];
          const aAvg =
            aR.length > 0
              ? aR.reduce((s, r) => s + r.rating, 0) / aR.length
              : 0;
          const bAvg =
            bR.length > 0
              ? bR.reduce((s, r) => s + r.rating, 0) / bR.length
              : 0;
          return bAvg - aAvg;
        });
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return list;
  }, [products, debouncedQuery, filters, sortBy, allReviews]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSearchParams({});
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 999999 ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 md:py-12">
      <Breadcrumbs />

      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {t("allProducts")}
      </h1>
      <p
        className="text-xs sm:text-sm md:text-base mb-5 sm:mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        {filtered.length} {t("products").toLowerCase()}
      </p>

      {/* Search banner */}
      {debouncedQuery.trim() && (
        <div
          className="mb-5 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 animate-fadeIn"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.1) 100%)",
            border: "1px solid #10b98160",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
              🔍 <strong style={{ color: "var(--accent)" }}>
                "{debouncedQuery}"
              </strong>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="p-1.5 rounded-lg transition hover:scale-110 cursor-pointer shrink-0"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
            aria-label={t("clear")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile toolbar */}
      <div className="lg:hidden flex items-center gap-2 mb-5">
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-xs transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <SlidersHorizontal size={14} />
          {t("filters")}
          {activeFilterCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
        <div
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <LayoutGrid size={14} />
          {paginatedProducts.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        <ProductFilters
          products={products}
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          totalResults={filtered.length}
        />

        <div>
          {products.length === 0 ? (
            <EmptyState
              type="notFound"
              customTitle={t("noProducts")}
              customDescription={t("noProducts")}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              type="search"
              customTitle={t("noProductsFound")}
              customDescription={t("noProductsFound")}
              customAction={
                <button
                  onClick={() => {
                    clearSearch();
                    setFilters({
                      categories: [],
                      priceRange: [0, 999999],
                      rating: 0,
                      inStockOnly: false,
                    });
                  }}
                  className="px-5 py-2.5 rounded-lg font-semibold text-white transition hover:scale-105 cursor-pointer text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  }}
                >
                  {t("clearFilters")}
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                {paginatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}