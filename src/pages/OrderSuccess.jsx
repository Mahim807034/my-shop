import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Home,
  Phone,
  MessageCircle,
  Tag,
} from "lucide-react";
import { useOrders } from "../store/orderStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import InvoiceButton from "../components/InvoiceButton";
import ShareOrderButton from "../components/ShareOrderButton";
import Confetti from "../components/Confetti";

const PAYMENT_LABELS = {
  cod: { labelKey: "cashOnDelivery", color: "#10b981" },
  bkash: { label: "bKash", color: "#e2136e" },
  nagad: { label: "Nagad", color: "#f58220" },
  card: { labelKey: "card", color: "#3b82f6" },
};

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useOrders((s) => s.orders);
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();

  const order = orders.find((o) => o.id === id);
  const currency = settings.currency || "৳";

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!order) {
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  useEffect(() => {
    if (order) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("loading")}
        </p>
      </div>
    );
  }

  const paymentInfo = PAYMENT_LABELS[order.paymentMethod] || PAYMENT_LABELS.cod;
  const paymentLabel = paymentInfo.labelKey
    ? t(paymentInfo.labelKey)
    : paymentInfo.label;

  return (
    <>
      <Confetti trigger={showConfetti} duration={4500} />

      <div
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 animate-fadeIn"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="w-full max-w-lg">
          <div
            className="rounded-2xl shadow-xl p-6 sm:p-8 text-center animate-scaleIn"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle
                  size={48}
                  className="text-green-500"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("orderPlaced")}
            </h1>
            <p
              className="text-sm sm:text-base mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("orderThankYou")}
            </p>

            <div
              className="rounded-xl p-4 mb-4 text-left space-y-2"
              style={{ background: "var(--bg-primary)" }}
            >
              <div className="flex justify-between text-xs sm:text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("orderId")}
                </span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {order.id}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("status")}
                </span>
                <span
                  className="font-semibold capitalize px-2 py-0.5 rounded-full text-xs"
                  style={{ background: "#f59e0b20", color: "#f59e0b" }}
                >
                  {t(order.status || "pending")}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("items")}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {order.items.length}
                </span>
              </div>
            </div>

            <div
              className="rounded-xl p-4 mb-6 text-left space-y-3"
              style={{ background: "var(--bg-primary)" }}
            >
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  {t("paymentMethod")}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: paymentInfo.color }}
                >
                  {paymentLabel}
                </span>
              </div>

              {order.couponCode && (
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span
                    className="flex items-center gap-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Tag size={12} /> {t("coupon")}
                  </span>
                  <span className="font-semibold" style={{ color: "#10b981" }}>
                    {order.couponCode} (-{currency}
                    {order.couponDiscount})
                  </span>
                </div>
              )}

              <div
                className="border-t pt-3 space-y-2 text-xs sm:text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    {t("subtotal")}
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {currency}
                    {order.subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    {t("delivery")}
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {currency}
                    {order.delivery || 60}
                  </span>
                </div>
                {order.couponDiscount > 0 && (
                  <div
                    className="flex justify-between"
                    style={{ color: "#10b981" }}
                  >
                    <span>{t("discount")}</span>
                    <span>
                      -{currency}
                      {order.couponDiscount}
                    </span>
                  </div>
                )}
                <div
                  className="flex justify-between font-bold text-base border-t pt-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--text-primary)" }}>
                    {t("total")}
                  </span>
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
                    {order.total}
                  </span>
                </div>
              </div>
            </div>

            {order.method === "whatsapp" ? (
              <div
                className="flex items-start gap-2 p-3 rounded-lg mb-6 text-left text-xs sm:text-sm"
                style={{ background: "#10b98120", color: "#10b981" }}
              >
                <MessageCircle size={16} className="mt-0.5 shrink-0" />
                <span>{t("whatsappNote")}</span>
              </div>
            ) : (
              <div
                className="flex items-start gap-2 p-3 rounded-lg mb-6 text-left text-xs sm:text-sm"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-secondary)",
                }}
              >
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>{t("callNote")}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 mb-4">
              <InvoiceButton order={order} />
              <ShareOrderButton order={order} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/orders"
                className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg text-sm cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Package size={16} /> {t("viewMyOrders")}
              </Link>
              <Link
                to="/"
                className="flex-1 py-2.5 sm:py-3 rounded-lg font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <Home size={16} /> {t("continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}