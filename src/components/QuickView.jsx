import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  ShoppingCart,
  Heart,
  Star,
  ExternalLink,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import { useCart } from "../store/cartStore";
import { useWishlist } from "../store/wishlistStore";
import { useReviews } from "../store/reviewStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function QuickView({ product, onClose }) {
  const addItem = useCart((s) => s.addItem);
  const buyNow = useCart((s) => s.buyNow);
  const { toggleItem, isInWishlist } = useWishlist();
  const settings = useSettings((s) => s.settings);
  const allReviews = useReviews((s) => s.reviews);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const currency = settings.currency || "৳";

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  const reviews = allReviews[product.id] || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty} × ${product.name}`);
    onClose();
  };

  const handleBuyNow = () => {
    buyNow(product, qty);
    toast.success(t("buyNow"));
    onClose();
    setTimeout(() => navigate("/checkout?buyNow=1"), 200);
  };

  const handleWishlist = () => {
    const added = toggleItem(product);
    toast.success(added ? `✓ ${t("wishlist")}` : `× ${t("wishlist")}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scaleIn"
        style={{ background: "var(--bg-secondary)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex justify-end p-3 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
            aria-label={t("close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg"
              style={{ background: "var(--bg-primary)" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <p
                className="text-xs mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.category}
              </p>
              <h2
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h2>

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= Math.round(avgRating) ? "#f59e0b" : "none"}
                        style={{
                          color:
                            s <= Math.round(avgRating)
                              ? "#f59e0b"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {avgRating.toFixed(1)} ({reviews.length})
                  </span>
                </div>
              )}

              <p
                className="text-2xl font-bold mb-4"
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
              </p>

              <p
                className="text-sm mb-4 line-clamp-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("quantity")}:
                </span>
                <div
                  className="flex items-center gap-3 border rounded-lg px-3 py-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-0.5 transition hover:scale-110 cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    className="w-8 text-center font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-0.5 transition hover:scale-110 cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  }}
                >
                  <Zap size={14} /> {t("buyNow")}
                </button>
                <button
                  onClick={handleAdd}
                  className="w-full py-2.5 rounded-lg font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  <ShoppingCart size={14} /> {t("addToCart")}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleWishlist}
                  className="flex-1 py-2 rounded-lg border text-xs font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    borderColor: "var(--border)",
                    color: inWishlist ? "#ef4444" : "var(--text-primary)",
                  }}
                >
                  <Heart size={12} fill={inWishlist ? "#ef4444" : "none"} />
                  {t("wishlist")}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 py-2 rounded-lg border text-xs font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <ExternalLink size={12} /> {t("productDetails")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}