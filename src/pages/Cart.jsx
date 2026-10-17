import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import EmptyState from "../components/EmptyState";
import { CartItemSkeleton } from "../components/Skeleton";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, buyNow } = useCart();
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const delivery = Number(settings.deliveryCharge) || 60;
  const currency = settings.currency || "৳";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBuyNow = (item) => {
    buyNow(item, item.quantity);
    toast.success(t("placeOrder"));
    setTimeout(() => navigate("/checkout?buyNow=1"), 200);
  };

  const handleCheckoutAll = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-5 sm:py-10">
        <div
          className="h-8 w-48 rounded-lg mb-6"
          style={{ background: "var(--bg-secondary)" }}
        />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <EmptyState type="cart" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 sm:py-10">
      <h1
        className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        {t("shoppingCart")}{" "}
        <span
          className="text-sm sm:text-base font-normal"
          style={{ color: "var(--text-secondary)" }}
        >
          ({items.length} {items.length !== 1 ? t("items") : t("item")})
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border hover:shadow-md transition-all"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex gap-3 sm:gap-4 flex-1">
                <Link
                  to={`/product/${item.id}`}
                  className="shrink-0 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover hover:scale-105 transition"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="block cursor-pointer"
                  >
                    <h3
                      className="font-semibold text-sm sm:text-base line-clamp-2 hover:opacity-80 transition"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  <p
                    className="font-bold text-base sm:text-lg mt-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {currency}
                    {item.price}
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-3 mt-2 sm:mt-3 flex-wrap">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 sm:p-1.5 border rounded transition hover:scale-110 active:scale-95 cursor-pointer"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                      }}
                      aria-label="-"
                    >
                      <Minus size={12} className="sm:hidden" />
                      <Minus size={14} className="hidden sm:block" />
                    </button>
                    <span
                      className="w-7 sm:w-8 text-center text-sm sm:text-base font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 sm:p-1.5 border rounded transition hover:scale-110 active:scale-95 cursor-pointer"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                      }}
                      aria-label="+"
                    >
                      <Plus size={12} className="sm:hidden" />
                      <Plus size={14} className="hidden sm:block" />
                    </button>

                    <span
                      className="text-xs sm:text-sm ml-2 font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t("subtotal")}:{" "}
                      <span
                        className="font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {currency}
                        {item.price * item.quantity}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 sm:justify-between sm:items-end shrink-0">
                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-white rounded-lg transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  }}
                >
                  <Zap size={12} />
                  {t("buyNow")}
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 sm:px-4 py-2 rounded-lg border text-red-500 transition-all hover:scale-105 active:scale-95 hover:bg-red-500 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Trash2 size={12} />
                  {t("remove")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="p-4 sm:p-6 rounded-xl border h-fit lg:sticky lg:top-24"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <h2
            className="text-base sm:text-xl font-bold mb-3 sm:mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {t("orderSummary")}
          </h2>
          <div
            className="flex justify-between mb-2 text-xs sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>
              {t("subtotal")} ({items.length}{" "}
              {items.length !== 1 ? t("items") : t("item")})
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              {currency}
              {total()}
            </span>
          </div>
          <div
            className="flex justify-between mb-3 sm:mb-4 text-xs sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>{t("delivery")}</span>
            <span style={{ color: "var(--text-primary)" }}>
              {currency}
              {delivery}
            </span>
          </div>
          <div
            className="border-t pt-3 sm:pt-4 flex justify-between font-bold text-sm sm:text-lg mb-4 sm:mb-6"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{t("total")}</span>
            <span
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {currency}
              {total() + delivery}
            </span>
          </div>

          <button
            onClick={handleCheckoutAll}
            className="w-full py-3 text-white rounded-lg font-semibold transition hover:scale-[1.02] active:scale-95 shadow-lg text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {t("proceedCheckout")} <ArrowRight size={16} />
          </button>

          <Link
            to="/products"
            className="block w-full text-center mt-3 px-4 py-2 text-xs sm:text-sm transition hover:underline cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            ← {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}