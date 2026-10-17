import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useWishlist } from "../store/wishlistStore";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useReviews } from "../store/reviewStore";
import StarRating from "../components/StarRating";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const addItem = useCart((s) => s.addItem);
  const settings = useSettings((s) => s.settings);
  const allReviews = useReviews((s) => s.reviews);
  const navigate = useNavigate();

  const currency = settings.currency || "৳";

  const handleMoveToCart = (product) => {
    addItem(product);
    removeItem(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleRemove = (id, name) => {
    removeItem(id);
    toast.success(`${name} removed from wishlist`);
  };

  const handleClearAll = () => {
    if (confirm("Clear all wishlist items?")) {
      clearWishlist();
      toast.success("Wishlist cleared");
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] py-6 sm:py-10 px-4 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 sm:mb-6 transition hover:-translate-x-1 text-sm sm:text-base cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} className="sm:hidden" />
          <ArrowLeft size={18} className="hidden sm:block" /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Heart
                size={26}
                style={{ color: "#ef4444" }}
                fill="#ef4444"
              />
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                My Wishlist
              </h1>
            </div>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {items.length} item{items.length !== 1 ? "s" : ""} saved for
              later
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-500 border border-red-500 rounded-full transition hover:bg-red-500 hover:text-white self-start cursor-pointer hover:scale-105 active:scale-95"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div
            className="text-center py-16 sm:py-20 rounded-2xl animate-scaleIn"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ background: "var(--bg-primary)" }}
            >
              <Heart
                size={40}
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
            <h2
              className="text-lg sm:text-xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Your wishlist is empty
            </h2>
            <p
              className="text-sm mb-6 max-w-md mx-auto px-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Save your favorite products here so you can find them easily
              later!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              <ShoppingCart size={18} /> Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {items.map((product) => {
              const reviews = allReviews[product.id] || [];
              const avgRating =
                reviews.length > 0
                  ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  : 0;

              return (
                <div
                  key={product.id}
                  className="group rounded-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col animate-fadeIn"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(product.id, product.name);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                      style={{
                        background: "#ef4444",
                        color: "white",
                      }}
                      aria-label="Remove from wishlist"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col">
                    <Link
                      to={`/product/${product.id}`}
                      className="block cursor-pointer"
                    >
                      <p
                        className="text-[10px] sm:text-xs mb-1 truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {product.category}
                      </p>
                      <h3
                        className="font-semibold mb-1.5 line-clamp-1 text-xs sm:text-sm md:text-base group-hover:opacity-80 transition"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
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

                    {/* Price */}
                    <p
                      className="text-base sm:text-lg font-bold mb-2"
                      style={{ color: "var(--accent)" }}
                    >
                      {currency}
                      {product.price}
                    </p>

                    {/* Actions */}
                    <div className="mt-auto flex gap-1.5">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 py-2 text-white rounded-lg transition-all hover:scale-[1.02] active:scale-95 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        style={{ background: "var(--accent)" }}
                      >
                        <ShoppingCart size={12} className="sm:hidden" />
                        <ShoppingCart size={14} className="hidden sm:block" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}