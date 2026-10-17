import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useWishlist } from "../store/wishlistStore";
import { useReviews } from "../store/reviewStore";
import { useLanguage } from "../store/languageStore";
import StarRating from "./StarRating";
import ScrollReveal from "./ScrollReveal";
import SmartImage from "./SmartImage";
import QuickView from "./QuickView";
import toast from "react-hot-toast";

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCart((s) => s.addItem);
  const settings = useSettings((s) => s.settings);
  const { toggleItem, isInWishlist } = useWishlist();
  const { t } = useLanguage();

  const allReviews = useReviews((s) => s.reviews);
  const reviews = product ? allReviews[product.id] || [] : [];

  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const currency = settings.currency || "৳";
  const inWishlist = product ? isInWishlist(product.id) : false;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} ✓`, { duration: 1500 });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product);
    toast.success(added ? `✓ ${t("wishlist")}` : `× ${t("wishlist")}`, {
      duration: 1500,
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  if (!product) return null;

  const delay = Math.min(index * 60, 400);

  return (
    <>
      <ScrollReveal animation="slideUp" delay={delay} duration={500}>
        <div
          className="group rounded-xl border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col cursor-pointer relative h-full"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)",
            }}
          />

          <Link
            to={`/product/${product.id}`}
            className="block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative z-10"
            aria-label={`${t("viewAll")} — ${product.name}`}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              aspectRatio="square"
              className="group-hover:scale-110 transition-transform duration-700"
            />

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-125 active:scale-95 cursor-pointer z-20"
              style={{
                background: inWishlist ? "#ef4444" : "var(--bg-secondary)",
                color: inWishlist ? "white" : "var(--text-primary)",
              }}
              aria-label={
                inWishlist
                  ? `${t("wishlist")} ❌`
                  : `${t("wishlist")} ✅`
              }
              aria-pressed={inWishlist}
            >
              <Heart size={14} fill={inWishlist ? "white" : "none"} />
            </button>

            {/* Quick View */}
            <button
              onClick={handleQuickView}
              className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-125 active:scale-95 cursor-pointer z-20"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              aria-label="Quick view"
            >
              <Eye size={14} />
            </button>
          </Link>

          <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col relative z-10">
            <Link to={`/product/${product.id}`} className="block">
              <p
                className="text-[10px] sm:text-xs mb-1 truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.category}
              </p>
              <h3
                className="font-semibold mb-1.5 line-clamp-1 text-xs sm:text-sm md:text-base group-hover:opacity-90 transition"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h3>
            </Link>

            {reviews.length > 0 && (
              <div className="mb-2">
                <StarRating
                  rating={avgRating}
                  size={11}
                  showValue
                  totalReviews={reviews.length}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-auto gap-1.5 sm:gap-2">
              <span
                className="text-sm sm:text-base md:text-lg font-bold truncate transition-all group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {currency}
                {product.price}
              </span>
              <button
                onClick={handleAdd}
                type="button"
                className="p-1.5 sm:p-2 text-white rounded-lg transition-all duration-300 hover:scale-125 active:scale-95 shadow-md shrink-0 cursor-pointer relative overflow-hidden group/btn"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
                aria-label={`${t("addToCart")} — ${product.name}`}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    backgroundSize: "1000px 100%",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
                <ShoppingCart size={14} className="sm:hidden relative z-10" />
                <ShoppingCart
                  size={16}
                  className="hidden sm:block relative z-10"
                />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {quickViewOpen && (
        <QuickView
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}