import { Link } from "react-router-dom";
import { Clock, X, ShoppingCart } from "lucide-react";
import { useRecent } from "../store/recentStore";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import ScrollReveal from "./ScrollReveal";
import toast from "react-hot-toast";

export default function RecentlyViewed({ currentProductId = null }) {
  const { items, getRecent, clearRecent } = useRecent();
  const addItem = useCart((s) => s.addItem);
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const currency = settings.currency || "৳";

  const recentProducts = getRecent(currentProductId);

  if (recentProducts.length < 2) return null;

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ✓`);
  };

  return (
    <ScrollReveal animation="slideUp">
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Clock size={18} style={{ color: "var(--accent)" }} />
              <h2
                className="text-lg sm:text-xl md:text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {t("recentlyViewed")}
              </h2>
            </div>
            <button
              onClick={clearRecent}
              className="text-xs sm:text-sm flex items-center gap-1 hover:underline cursor-pointer transition"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={12} /> {t("clear")}
            </button>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group shrink-0 w-40 sm:w-48 rounded-xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-2.5 sm:p-3">
                  <h3
                    className="font-semibold text-xs sm:text-sm mb-1 line-clamp-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="text-sm sm:text-base font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {currency}
                      {p.price}
                    </span>
                    <button
                      onClick={(e) => handleAdd(e, p)}
                      className="p-1.5 text-white rounded-lg transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}
                      aria-label={t("addToCart")}
                    >
                      <ShoppingCart size={12} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}