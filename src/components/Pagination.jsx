import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 12,
}) {
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex flex-col items-center gap-3 mt-8 sm:mt-10"
      aria-label="Pagination"
    >
      {showInfo && totalItems > 0 && (
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {(currentPage - 1) * itemsPerPage + 1}
          </span>
          –
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>
          {" / "}
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {totalItems}
          </span>
          {" "}
          {totalItems !== 1 ? t("results") : t("result")}
        </p>
      )}

      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label={t("back")}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${i}`}
                className="px-2 py-1"
                style={{ color: "var(--text-secondary)" }}
              >
                <MoreHorizontal size={14} />
              </span>
            );
          }

          const isActive = currentPage === p;
          return (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className="min-w-9 h-9 sm:min-w-10 sm:h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                  : "var(--bg-secondary)",
                color: isActive ? "white" : "var(--text-primary)",
                border: `1px solid ${
                  isActive ? "transparent" : "var(--border)"
                }`,
              }}
              aria-label={`${t("productDetails") || "Page"} ${p}`}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}