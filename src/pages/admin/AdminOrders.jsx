import { useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  X,
  CheckCircle,
  Truck,
  Clock,
  Phone,
  MapPin,
  User,
  Package,
  Filter,
  MessageCircle,
  Globe,
  XCircle,
  ShoppingBag,
  Languages,
} from "lucide-react";
import { useOrders } from "../../store/orderStore";
import { useSettings } from "../../store/settingsStore";
import toast from "react-hot-toast";

const statuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors = {
  pending: { bg: "#f59e0b20", color: "#f59e0b", icon: Clock },
  confirmed: { bg: "#3b82f620", color: "#3b82f6", icon: CheckCircle },
  shipped: { bg: "#8b5cf620", color: "#8b5cf6", icon: Truck },
  delivered: { bg: "#10b98120", color: "#10b981", icon: CheckCircle },
  cancelled: { bg: "#ef444420", color: "#ef4444", icon: XCircle },
};

// ---- i18n dictionary ----
const translations = {
  en: {
    orders: "Orders",
    totalOrders: (n) => `${n} total order${n !== 1 ? "s" : ""}`,
    searchPlaceholder: "Search by ID, name, phone...",
    allStatus: "All Status",
    allSources: "All Sources",
    website: "Website",
    whatsapp: "WhatsApp",
    noOrdersYet: "No orders yet",
    noMatchFilters: "No orders match your filters",
    orderItems: (n) => `Order Items (${n})`,
    showLess: "Show Less",
    showAll: (n) => `Show All (${n})`,
    moreItems: (n) => `+ ${n} more items...`,
    price: "Price",
    qty: "Qty",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    updateStatus: "Update Status:",
    viewDetails: "View Details",
    deleteOrder: "Delete Order",
    deleteConfirm: "Delete this order?",
    orderDeleted: "Order deleted",
    statusChanged: (s) => `Status → ${s}`,
    orderDetails: "Order Details",
    customerInfo: "Customer Info",
    items: (n) => `Items (${n})`,
    name: "Name",
    phone: "Phone",
    address: "Address",
    note: "Note",
    statuses: {
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
  },
  bn: {
    orders: "অর্ডার",
    totalOrders: (n) => `মোট ${n}টি অর্ডার`,
    searchPlaceholder: "আইডি, নাম, ফোন দিয়ে খুঁজুন...",
    allStatus: "সব স্ট্যাটাস",
    allSources: "সব সোর্স",
    website: "ওয়েবসাইট",
    whatsapp: "হোয়াটসঅ্যাপ",
    noOrdersYet: "এখনো কোনো অর্ডার নেই",
    noMatchFilters: "ফিল্টারের সাথে কোনো অর্ডার মেলেনি",
    orderItems: (n) => `অর্ডার আইটেম (${n})`,
    showLess: "কম দেখান",
    showAll: (n) => `সব দেখান (${n})`,
    moreItems: (n) => `+ আরও ${n}টি আইটেম...`,
    price: "দাম",
    qty: "পরিমাণ",
    subtotal: "সাবটোটাল",
    delivery: "ডেলিভারি",
    total: "মোট",
    updateStatus: "স্ট্যাটাস পরিবর্তন:",
    viewDetails: "বিস্তারিত দেখুন",
    deleteOrder: "অর্ডার ডিলিট",
    deleteConfirm: "এই অর্ডারটি ডিলিট করবেন?",
    orderDeleted: "অর্ডার ডিলিট হয়েছে",
    statusChanged: (s) => `স্ট্যাটাস → ${s}`,
    orderDetails: "অর্ডার বিস্তারিত",
    customerInfo: "কাস্টমার তথ্য",
    items: (n) => `আইটেম (${n})`,
    name: "নাম",
    phone: "ফোন",
    address: "ঠিকানা",
    note: "নোট",
    statuses: {
      pending: "পেন্ডিং",
      confirmed: "কনফার্মড",
      shipped: "শিপড",
      delivered: "ডেলিভারড",
      cancelled: "ক্যান্সেলড",
    },
  },
};

export default function AdminOrders() {
  const { orders, removeOrder, updateOrderStatus } = useOrders();
  const settings = useSettings((s) => s.settings);
  const currency = settings.currency || "৳";

  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleExpand = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLang = () => setLang((l) => (l === "en" ? "bn" : "en"));

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.name?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.items?.some((i) => i.name.toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" ||
      (methodFilter === "website" && o.method !== "whatsapp") ||
      o.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleDelete = (id) => {
    if (confirm(t.deleteConfirm)) {
      removeOrder(id);
      toast.success(t.orderDeleted);
    }
  };

  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
    toast.success(t.statusChanged(t.statuses[status]));
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {t.orders}
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.totalOrders(orders.length)}
          </p>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
          title={lang === "en" ? "বাংলায় দেখুন" : "View in English"}
        >
          <Languages size={16} />
          {lang === "en" ? "বাংলা" : "English"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-xs sm:text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border)",
              }}
            >
              <option value="all">{t.allStatus}</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {t.statuses[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-secondary)" }}
            />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-xs sm:text-sm appearance-none cursor-pointer"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border)",
              }}
            >
              <option value="all">{t.allSources}</option>
              <option value="website">{t.website}</option>
              <option value="whatsapp">{t.whatsapp}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <Package
            size={40}
            className="mx-auto mb-3"
            style={{ color: "var(--text-secondary)" }}
          />
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {orders.length === 0 ? t.noOrdersYet : t.noMatchFilters}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const StatusIcon =
              statusColors[order.status || "pending"]?.icon || Clock;
            const statusStyle = statusColors[order.status || "pending"];
            const isWhatsApp = order.method === "whatsapp";
            const isExpanded = expandedOrders[order.id];

            return (
              <div
                key={order.id}
                className="rounded-xl border overflow-hidden transition-all hover:shadow-lg animate-fadeIn"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Header row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className="text-[10px] sm:text-xs font-mono font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: "var(--bg-primary)",
                          color: "var(--accent)",
                        }}
                      >
                        {order.id}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        <StatusIcon size={10} />
                        {t.statuses[order.status || "pending"]}
                      </span>
                      {isWhatsApp ? (
                        <span
                          className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                          style={{
                            background: "#10b98120",
                            color: "#10b981",
                          }}
                        >
                          <MessageCircle size={10} />
                          {t.whatsapp}
                        </span>
                      ) : (
                        <span
                          className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                          style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <Globe size={10} />
                          {t.website}
                        </span>
                      )}
                      <span
                        className="text-[10px] sm:text-xs ml-auto font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: "var(--accent)",
                          color: "white",
                        }}
                      >
                        {currency}
                        {order.total}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p
                        className="text-sm font-medium flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <User size={14} style={{ color: "var(--text-secondary)" }} />
                        {order.name}
                      </p>
                      <p
                        className="text-sm flex items-center gap-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Phone size={14} />
                        {order.phone}
                      </p>
                      <p
                        className="text-sm flex items-start gap-2 sm:col-span-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="break-words">{order.address}</span>
                      </p>
                      {order.note && (
                        <p
                          className="text-xs flex items-start gap-2 sm:col-span-2 p-2 rounded-lg"
                          style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span className="font-semibold shrink-0">{t.note}:</span>
                          <span className="break-words">{order.note}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Details */}
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
                        {t.orderItems(order.items.length)}
                      </h3>
                    </div>
                    {order.items.length > 2 && (
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="text-xs cursor-pointer hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {isExpanded
                          ? t.showLess
                          : t.showAll(order.items.length)}
                      </button>
                    )}
                  </div>

                  {/* Product list */}
                  <div className="space-y-2">
                    {(isExpanded ? order.items : order.items.slice(0, 2)).map(
                      (item, i) => (
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
                                {t.price}:{" "}
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
                                {t.qty}:{" "}
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
                              {t.subtotal}
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
                      )
                    )}

                    {!isExpanded && order.items.length > 2 && (
                      <p
                        className="text-xs text-center py-1 cursor-pointer hover:underline"
                        onClick={() => toggleExpand(order.id)}
                        style={{ color: "var(--accent)" }}
                      >
                        {t.moreItems(order.items.length - 2)}
                      </p>
                    )}
                  </div>

                  {/* Order summary */}
                  <div
                    className="mt-4 p-3 rounded-lg grid grid-cols-3 gap-3 text-center"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-wider mb-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t.subtotal}
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
                        {t.delivery}
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
                        {t.total}
                      </p>
                      <p
                        className="font-bold text-sm"
                        style={{ color: "var(--accent)" }}
                      >
                        {currency}
                        {order.total}
                      </p>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t.updateStatus}
                    </span>

                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="text-xs px-3 py-2 rounded-lg border focus:outline-none cursor-pointer font-semibold"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: `${statusStyle.color}40`,
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {t.statuses[s]}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg border transition hover:scale-110 active:scale-95 cursor-pointer"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                        title={t.viewDetails}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 rounded-lg border text-red-500 transition hover:scale-110 active:scale-95 hover:bg-red-500 hover:text-white cursor-pointer"
                        style={{ borderColor: "var(--border)" }}
                        title={t.deleteOrder}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          currency={currency}
          t={t}
        />
      )}
    </div>
  );
}

function OrderModal({ order, onClose, currency, t }) {
  const StatusIcon =
    statusColors[order.status || "pending"]?.icon || Clock;
  const statusStyle = statusColors[order.status || "pending"];
  const isWhatsApp = order.method === "whatsapp";

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
              {t.orderDetails}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p
                className="text-[10px] sm:text-xs font-mono truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {order.id}
              </p>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                }}
              >
                <StatusIcon size={10} /> {t.statuses[order.status || "pending"]}
              </span>
              {isWhatsApp ? (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{ background: "#10b98120", color: "#10b981" }}
                >
                  <MessageCircle size={9} /> {t.whatsapp}
                </span>
              ) : (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Globe size={9} /> {t.website}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          <div>
            <h3
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.customerInfo}
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={<User size={14} />}
                label={t.name}
                value={order.name}
              />
              <InfoRow
                icon={<Phone size={14} />}
                label={t.phone}
                value={order.phone}
              />
              <InfoRow
                icon={<MapPin size={14} />}
                label={t.address}
                value={order.address}
              />
              {order.note && (
                <InfoRow
                  icon={<Package size={14} />}
                  label={t.note}
                  value={order.note}
                />
              )}
            </div>
          </div>

          <div>
            <h3
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.items(order.items.length)}
            </h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold truncate text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {currency}
                      {item.price} × {item.quantity}
                    </p>
                  </div>
                  <p
                    className="font-bold shrink-0 text-sm"
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
            className="p-3 sm:p-4 rounded-xl space-y-2"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>{t.subtotal}</span>
              <span style={{ color: "var(--text-primary)" }}>
                {currency}
                {order.subtotal}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>{t.delivery}</span>
              <span style={{ color: "var(--text-primary)" }}>
                {currency}
                {order.delivery || 60}
              </span>
            </div>
            <div
              className="flex justify-between font-bold text-base border-t pt-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--text-primary)" }}>{t.total}</span>
              <span style={{ color: "var(--accent)" }}>
                {currency}
                {order.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-xs sm:text-sm">
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