import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Globe,
  ArrowLeft,
  Check,
  ShoppingBag,
  Tag,
  X,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useCart } from "../store/cartStore";
import { useAuth } from "../store/authStore";
import { useOrders } from "../store/orderStore";
import { useSettings } from "../store/settingsStore";
import { useCoupons } from "../store/couponStore";
import { useLanguage } from "../store/languageStore";
import PaymentMethods from "../components/PaymentMethods";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, total, clearCart, isBuyNow, restoreCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const settings = useSettings((s) => s.settings);
  const { applyCoupon } = useCoupons();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isBuyNowMode = searchParams.get("buyNow") === "1";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [orderMethod, setOrderMethod] = useState("website");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const currency = settings.currency || "৳";
  const delivery = Number(settings.deliveryCharge) || 60;

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        phone: f.phone || user.phone || "",
        address:
          f.address ||
          (user.address
            ? `${user.address}${user.city ? `, ${user.city}` : ""}`
            : ""),
      }));
    }
  }, [user]);

  const handleCancelBuyNow = () => {
    if (isBuyNowMode) {
      if (confirm(`${t("cancel")}?`)) {
        restoreCart();
        toast.success("Cart restored");
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-16 sm:py-20 text-center"
        style={{ color: "var(--text-primary)" }}
      >
        <ShoppingBag
          size={48}
          className="mx-auto mb-4"
          style={{ color: "var(--text-secondary)" }}
        />
        <h1 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">
          {t("emptyCart")}
        </h1>
        <Link
          to="/products"
          className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg font-semibold transition hover:scale-105 text-sm sm:text-base cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        >
          {t("startShopping")}
        </Link>
      </div>
    );
  }

  const subtotal = total();
  const couponDiscount = appliedCoupon?.discount || 0;
  const finalTotal = subtotal + delivery - couponDiscount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError("");

    const res = applyCoupon(couponCode, subtotal, delivery);

    if (!res.success) {
      setCouponError(res.error);
      toast.error(res.error);
      return;
    }

    setAppliedCoupon(res);
    toast.success(`Coupon applied! ${currency}${res.discount}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success(t("remove"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (orderMethod === "whatsapp") {
      const orderLines = items
        .map(
          (i) =>
            `• ${i.name} x${i.quantity} = ${currency}${i.price * i.quantity}`
        )
        .join("%0A");

      const msg = `🛒 New Order%0A%0AName: ${form.name}%0APhone: ${
        form.phone
      }%0AAddress: ${form.address}${
        form.note ? `%0ANote: ${form.note}` : ""
      }%0A%0AItems:%0A${orderLines}%0A%0ATotal: ${currency}${finalTotal}`;

      window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, "_blank");
    }

    const order = addOrder({
      name: form.name,
      phone: form.phone,
      address: form.address,
      note: form.note,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      total: finalTotal,
      delivery,
      method: orderMethod,
      paymentMethod,
      couponCode: appliedCoupon?.coupon?.code || null,
      couponDiscount,
    });

    clearCart();
    toast.success(
      orderMethod === "whatsapp"
        ? "Opening WhatsApp..."
        : t("placeOrder") + " ✓"
    );
    setLoading(false);
    navigate(`/order-success/${order.id}`);
  };

  const inputStyle = {
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn"
      style={{ color: "var(--text-primary)" }}
    >
      <button
        onClick={handleCancelBuyNow}
        className="flex items-center gap-2 mb-4 sm:mb-6 transition hover:-translate-x-1 text-sm cursor-pointer"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} /> {t("back")}
      </button>

      {isBuyNowMode && (
        <div
          className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs animate-fadeIn"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(59,130,246,0.2) 100%)",
            border: "1px solid var(--accent)",
          }}
        >
          <Zap size={14} style={{ color: "var(--accent)" }} />
          <span
            style={{ color: "var(--accent)" }}
            className="font-semibold"
          >
            ⚡ {t("buyNow")}
          </span>
        </div>
      )}

      <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
        {t("checkout")}
      </h1>
      {user && (
        <p
          className="text-xs sm:text-sm mb-4 sm:mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("orderingAs")} <span className="font-semibold">{user.name}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Method */}
        <div
          className="rounded-xl border p-3 sm:p-4"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs sm:text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("howToOrder")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderMethod("website")}
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                orderMethod === "website"
                  ? "scale-[1.02] shadow-lg"
                  : "hover:scale-[1.01]"
              }`}
              style={{
                borderColor:
                  orderMethod === "website"
                    ? "var(--accent)"
                    : "var(--border)",
                background:
                  orderMethod === "website"
                    ? "var(--bg-primary)"
                    : "transparent",
              }}
            >
              {orderMethod === "website" && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--accent)" }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ background: "var(--accent)" }}
              >
                <Globe size={20} className="text-white" />
              </div>
              <p
                className="font-bold text-xs sm:text-sm mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t("placeOrderWebsite")}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setOrderMethod("whatsapp")}
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                orderMethod === "whatsapp"
                  ? "scale-[1.02] shadow-lg"
                  : "hover:scale-[1.01]"
              }`}
              style={{
                borderColor:
                  orderMethod === "whatsapp"
                    ? "#10b981"
                    : "var(--border)",
                background:
                  orderMethod === "whatsapp"
                    ? "var(--bg-primary)"
                    : "transparent",
              }}
            >
              {orderMethod === "whatsapp" && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#10b981" }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                style={{ background: "#10b981" }}
              >
                <MessageCircle size={20} className="text-white" />
              </div>
              <p
                className="font-bold text-xs sm:text-sm mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t("placeOrderWhatsApp")}
              </p>
            </button>
          </div>
        </div>

        <PaymentMethods
          selected={paymentMethod}
          onChange={setPaymentMethod}
        />

        <input
          type="text"
          placeholder={`${t("fullName")} *`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
          style={inputStyle}
          required
        />
        <input
          type="tel"
          placeholder={`${t("phone")} *`}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
          style={inputStyle}
          required
        />
        <textarea
          placeholder={`${t("address")} *`}
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border focus:outline-none focus:ring-2 transition text-sm sm:text-base resize-none"
          style={inputStyle}
          required
        />
        <textarea
          placeholder={t("note")}
          rows={2}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border focus:outline-none focus:ring-2 transition text-sm sm:text-base resize-none"
          style={inputStyle}
        />

        {/* Coupon */}
        <div
          className="rounded-xl border p-3 sm:p-4"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs sm:text-sm font-semibold mb-3 flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Tag size={14} /> {t("coupon")}
          </p>

          {appliedCoupon ? (
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: "#10b98120" }}
            >
              <div className="min-w-0">
                <p
                  className="font-bold text-sm flex items-center gap-2"
                  style={{ color: "#10b981" }}
                >
                  <Check size={14} /> {appliedCoupon.coupon.code}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="p-1.5 rounded cursor-pointer hover:scale-110 shrink-0"
                style={{ color: "#ef4444" }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  placeholder={t("couponCode")}
                  className="flex-1 px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm font-mono"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-lg font-semibold text-white cursor-pointer hover:scale-105 transition text-sm shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  }}
                >
                  {t("apply")}
                </button>
              </div>
              {couponError && (
                <p
                  className="text-xs mt-2 flex items-center gap-1"
                  style={{ color: "#ef4444" }}
                >
                  <AlertCircle size={12} /> {couponError}
                </p>
              )}
              <p
                className="text-[10px] sm:text-xs mt-2 italic"
                style={{ color: "var(--text-secondary)" }}
              >
                Try: WELCOME10, SAVE200, FREESHIP
              </p>
            </>
          )}
        </div>

        {/* Summary */}
        <div
          className="p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>
              {currency}
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("delivery")}</span>
            <span>
              {currency}
              {delivery}
            </span>
          </div>
          {appliedCoupon && (
            <div
              className="flex justify-between"
              style={{ color: "#10b981" }}
            >
              <span>{appliedCoupon.coupon.code}</span>
              <span>
                -{currency}
                {couponDiscount}
              </span>
            </div>
          )}
          <div
            className="flex justify-between font-bold border-t pt-2 mt-2 text-base sm:text-lg"
            style={{ borderColor: "var(--border)" }}
          >
            <span>{t("total")}</span>
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
              {finalTotal}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          style={{
            background:
              orderMethod === "whatsapp"
                ? "#10b981"
                : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        >
          {loading ? (
            t("loading")
          ) : orderMethod === "whatsapp" ? (
            <>
              <MessageCircle size={18} /> {t("placeOrderWhatsApp")}
            </>
          ) : (
            <>
              <Zap size={18} /> {isBuyNowMode ? t("buyNow") : t("placeOrder")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}