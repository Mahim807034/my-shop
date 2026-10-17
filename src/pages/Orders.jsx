import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Search,
  Trash2,
  Eye,
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  MessageCircle,
  Globe,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { useOrders } from "../store/orderStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import OrderTimeline from "../components/OrderTimeline";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import { OrderListSkeleton } from "../components/Skeleton";
import InvoiceButton from "../components/InvoiceButton";
import ShareOrderButton from "../components/ShareOrderButton";
import toast from "react-hot-toast";

const statusColors = {
  pending: { bg: "#f59e0b20", color: "#f59e0b", icon: Clock },
  confirmed: { bg: "#3b82f620", color: "#3b82f6", icon: CheckCircle },
  shipped: { bg: "#8b5cf620", color: "#8b5cf6", icon: Truck },
  delivered: { bg: "#10b98120", color: "#10b981", icon: CheckCircle },
  cancelled: { bg: "#ef444420", color: "#ef4444", icon: XCircle },
};

export default function Orders() {
  const { user } = useAuth();
  const { orders, removeOrder, clearOrders, updateOrderStatus } = useOrders();
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const currency = settings.currency || "৳";

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-6 sm:py-10 px-4 animate-fadeIn">
        <div className="max-w-4xl mx-auto">
          <div
            className="h-4 w-32 rounded-lg mb-6"
            style={{ background: "var(--bg-secondary)" }}
          />
          <div
            className="h-8 w-48 rounded-lg mb-2"
            style={{ background: "var(--bg-secondary)" }}
          />
          <div
            className="h-4 w-40 rounded-lg mb-6"
            style={{ background: "var(--bg-secondary)" }}
          />
          <div
            className="h-12 w-full rounded-lg mb-5"
            style={{ background: "var(--bg-secondary)" }}
          />
          <OrderListSkeleton count={3} />
        </div>
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.items?.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  const toggleExpand = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (id) => {
    if (confirm(`${t("remove")}?`)) {
      removeOrder(id);
      toast.success(`${t("remove")} ✓`);
    }
  };

  const handleCancelOrder = (id) => {
    if (confirm(`${t("cancelOrder")}?`)) {
      updateOrderStatus(id, "cancelled");
      toast.success(t("cancelled"));
    }
  };

  const handleClearAll = () => {
    if (confirm(`${t("clearAll")}?`)) {
      clearOrders();
      toast.success(`${t("clearAll")} ✓`);
    }
  };

  const getStatusLabel = (status) => {
    return t(status || "pending");
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] py-6 sm:py-10 px-4 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 sm:mb-6 transition hover:-translate-x-1 text-sm sm:text-base cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} className="sm:hidden" />
          <ArrowLeft size={18} className="hidden sm:block" /> {t("back")}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h1
              className="text-xl sm:text-3xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {t("myOrders")}
            </h1>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {orders.length} {t("orderHistory")}
            </p>
          </div>

          {orders.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-500 border border-red-500 rounded-full transition hover:bg-red-500 hover:text-white self-start cursor-pointer hover:scale-105 active:scale-95"
            >
              {t("clearAll")}
            </button>
          )}
        </div>

        {orders.length > 0 && (
          <div className="relative mb-5 sm:mb-6">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyState type="orders" />
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12 sm:py-16 rounded-xl sm:rounded-2xl"
            style={{ background: "var(--bg-secondary)" }}
          >
            <p
              className="text-sm sm:text-base mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("noProductsFound")}: "{search}"
            </p>
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 rounded-lg font-semibold text-white text-xs cursor-pointer hover:scale-105 transition"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            >
              {t("clear")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status = order.status || "pending";
              const statusStyle = statusColors[status] || statusColors.pending;
              const StatusIcon = statusStyle.icon;
              const isWhatsApp = order.method === "whatsapp";
              const isExpanded = expandedOrders[order.id];
              const canCancel =
                status !== "delivered" && status !== "cancelled";

              return (
                <div
                  key={order.id}
                  className="rounded-xl sm:rounded-2xl border overflow-hidden transition-all hover:shadow-lg animate-fadeIn"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex flex-col sm:flex-row sm:items-start gap-3 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className="text-[10px] sm:text-xs font-mono font-semibold px-2 sm:px-3 py-1 rounded-full"
                          style={{
                            background: "var(--bg-primary)",
                            color: "var(--accent)",
                          }}
                        >
                          {order.id}
                        </span>
                        <span
                          className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 capitalize"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          <StatusIcon size={10} />
                          {getStatusLabel(status)}
                        </span>
                        {isWhatsApp ? (
                          <span
                            className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1"
                            style={{
                              background: "#10b98120",
                              color: "#10b981",
                            }}
                          >
                            <MessageCircle size={10} />
                            WhatsApp
                          </span>
                        ) : (
                          <span
                            className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1"
                            style={{
                              background: "var(--bg-primary)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <Globe size={10} />
                            Website
                          </span>
                        )}
                        <span
                          className="text-[10px] sm:text-xs flex items-center gap-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Calendar size={12} />
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t("address")}:{" "}
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {order.address?.slice(0, 50)}
                          {order.address?.length > 50 ? "..." : ""}
                        </span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                      <div className="text-right">
                        <p
                          className="text-[10px] sm:text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {t("total")}
                        </p>
                        <p
                          className="text-base sm:text-xl font-bold"
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
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="px-4 pt-4">
                    <OrderTimeline status={status} />
                  </div>

                  {/* Items */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ShoppingBag
                          size={16}
                          style={{ color: "var(--accent)" }}
                        />
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {t("items")} ({order.items.length})
                        </h3>
                      </div>
                      {order.items.length > 2 && (
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-xs cursor-pointer hover:underline hover:scale-105 active:scale-95 transition"
                          style={{ color: "var(--accent)" }}
                        >
                          {isExpanded
                            ? t("showLess")
                            : `${t("showAll")} (${order.items.length})`}
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {(isExpanded
                        ? order.items
                        : order.items.slice(0, 2)
                      ).map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-lg border"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border"
                            style={{ borderColor: "var(--border)" }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/100x100?text=?";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold text-sm truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {t("price") || "Price"}:{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {currency}
                                  {item.price}
                                </span>
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {t("quantity")}:{" "}
                                <span
                                  className="font-semibold"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {item.quantity}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              className="text-[10px]"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {t("subtotal")}
                            </p>
                            <p
                              className="font-bold text-sm"
                              style={{ color: "var(--accent)" }}
                            >
                              {currency}
                              {item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}

                      {!isExpanded && order.items.length > 2 && (
                        <p
                          className="text-xs text-center py-1 cursor-pointer hover:underline"
                          onClick={() => toggleExpand(order.id)}
                          style={{ color: "var(--accent)" }}
                        >
                          + {order.items.length - 2} {t("moreItems")}
                        </p>
                      )}
                    </div>

                    {/* Summary */}
                    <div
                      className="mt-4 p-3 rounded-lg grid grid-cols-3 gap-3 text-center"
                      style={{ background: "var(--bg-primary)" }}
                    >
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider mb-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {t("subtotal")}
                        </p>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {currency}
                          {order.subtotal}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider mb-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {t("delivery")}
                        </p>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {currency}
                          {order.delivery || 60}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider mb-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {t("total")}
                        </p>
                        <p
                          className="font-bold text-sm"
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
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Eye size={14} /> {t("viewDetails")}
                      </button>

                      <InvoiceButton order={order} variant="icon" />
                      <ShareOrderButton order={order} variant="icon" />

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-medium text-red-500 transition-all hover:scale-[1.02] active:scale-95 hover:bg-red-500 hover:text-white flex items-center gap-2 cursor-pointer"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <XCircle size={14} />
                          {t("cancelOrder")}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2.5 rounded-lg border text-red-500 transition-all hover:scale-110 active:scale-95 hover:bg-red-500 hover:text-white cursor-pointer"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          currency={currency}
          t={t}
        />
      )}
    </div>
  );
}

/* Detail Modal */
function OrderDetailModal({ order, onClose, currency, t }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const status = order.status || "pending";
  const statusStyle = statusColors[status] || statusColors.pending;
  const StatusIcon = statusStyle.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scaleIn"
        style={{ background: "var(--bg-secondary)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b z-10"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="min-w-0">
            <h2
              className="text-base sm:text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("orderId")}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p
                className="text-[10px] sm:text-xs font-mono truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {order.id}
              </p>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 capitalize"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                }}
              >
                <StatusIcon size={10} /> {t(status)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg transition hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          <OrderTimeline status={status} />

          <div>
            <h3
              className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("address")}
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={<User size={14} />}
                label={t("fullName")}
                value={order.name}
              />
              <InfoRow
                icon={<Phone size={14} />}
                label={t("phone")}
                value={order.phone}
              />
              <InfoRow
                icon={<MapPin size={14} />}
                label={t("address")}
                value={order.address}
              />
              {order.note && (
                <InfoRow
                  icon={<ShoppingBag size={14} />}
                  label={t("note")}
                  value={order.note}
                />
              )}
            </div>
          </div>

          <div>
            <h3
              className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("items")} ({order.items.length})
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium truncate text-sm sm:text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {currency}
                      {item.price} × {item.quantity}
                    </p>
                  </div>
                  <p
                    className="font-bold shrink-0 text-sm sm:text-base"
                    style={{ color: "var(--accent)" }}
                  >
                    {currency}
                    {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-3 sm:p-4 rounded-lg sm:rounded-xl space-y-2"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex justify-between text-xs sm:text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("subtotal")}
              </span>
              <span style={{ color: "var(--text-primary)" }}>
                {currency}
                {order.subtotal}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                {t("delivery")}
              </span>
              <span style={{ color: "var(--text-primary)" }}>
                {currency}
                {order.delivery || 60}
              </span>
            </div>
            <div
              className="flex justify-between font-bold text-base sm:text-lg border-t pt-2"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <InvoiceButton order={order} />
            <ShareOrderButton order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
      <span
        className="mt-0.5 shrink-0"
        style={{ color: "var(--text-secondary)" }}
      >
        {icon}
      </span>
      <span
        className="font-medium shrink-0"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}:
      </span>
      <span
        className="min-w-0 break-words"
        style={{ color: "var(--text-primary)" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}