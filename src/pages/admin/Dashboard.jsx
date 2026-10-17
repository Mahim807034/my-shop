import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Activity,
  BarChart3,
  Eye,
  MousePointer,
  Trash2,
} from "lucide-react";
import { useProducts } from "../../store/productStore";
import { useOrders } from "../../store/orderStore";
import { useSettings } from "../../store/settingsStore";
import { useLanguage } from "../../store/languageStore";
import { getAnalyticsSummary, clearAnalytics } from "../../utils/analytics";
import toast from "react-hot-toast";

export default function Dashboard() {
  const products = useProducts((s) => s.products);
  const orders = useOrders((s) => s.orders);
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const currency = settings.currency || "৳";

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(getAnalyticsSummary());
  }, []);

  const handleClearAnalytics = () => {
    if (confirm(`${t("clear")}?`)) {
      clearAnalytics();
      setAnalytics(getAnalyticsSummary());
      toast.success(`✓ ${t("clear")}`);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const statusCounts = {
    pending: orders.filter((o) => o.status === "pending" || !o.status).length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const totalOrders = orders.length;

  const stats = [
    {
      title: t("totalProducts"),
      value: products.length,
      icon: Package,
      color: "#3b82f6",
      link: "/admin/products",
    },
    {
      title: t("totalOrders"),
      value: totalOrders,
      icon: ShoppingBag,
      color: "#8b5cf6",
      link: "/admin/orders",
    },
    {
      title: t("revenue"),
      value: `${currency}${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#10b981",
      link: "/admin/orders",
    },
    {
      title: t("deliveredRevenue"),
      value: `${currency}${deliveredRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "#f59e0b",
      link: "/admin/orders",
    },
  ];

  const statusStats = [
    {
      key: "pending",
      label: t("pending"),
      value: statusCounts.pending,
      icon: Clock,
      color: "#f59e0b",
      bg: "#f59e0b20",
    },
    {
      key: "confirmed",
      label: t("confirmed"),
      value: statusCounts.confirmed,
      icon: CheckCircle,
      color: "#3b82f6",
      bg: "#3b82f620",
    },
    {
      key: "shipped",
      label: t("shipped"),
      value: statusCounts.shipped,
      icon: Truck,
      color: "#8b5cf6",
      bg: "#8b5cf620",
    },
    {
      key: "delivered",
      label: t("delivered"),
      value: statusCounts.delivered,
      icon: CheckCircle,
      color: "#10b981",
      bg: "#10b98120",
    },
    {
      key: "cancelled",
      label: t("cancelled"),
      value: statusCounts.cancelled,
      icon: XCircle,
      color: "#ef4444",
      bg: "#ef444420",
    },
  ];

  const getPercent = (count) =>
    totalOrders ? Math.round((count / totalOrders) * 100) : 0;

  return (
    <div className="animate-fadeIn pb-6">
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {t("dashboard")}
        </h1>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("dashboardWelcome")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((s, i) => (
          <Link
            key={s.title}
            to={s.link}
            className="p-3 sm:p-4 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg animate-fadeIn cursor-pointer hover:scale-[1.02] active:scale-95"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
              animationDelay: `${(i + 1) * 100}ms`,
            }}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3"
              style={{ background: `${s.color}20` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p
              className="text-[10px] sm:text-xs mb-1 truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.title}
            </p>
            <p
              className="text-base sm:text-2xl font-bold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div
        className="rounded-xl border p-4 sm:p-5 mb-6 animate-fadeIn"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
          animationDelay: "200ms",
        }}
      >
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Activity size={18} style={{ color: "var(--accent)" }} />
            <h2
              className="font-bold text-base sm:text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {t("orderStatus")}
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs sm:text-sm flex items-center gap-1 transition-all hover:gap-2 cursor-pointer hover:scale-105"
            style={{ color: "var(--accent)" }}
          >
            {t("manage")} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
          {statusStats.map((s) => (
            <Link
              key={s.key}
              to="/admin/orders"
              className="p-3 rounded-lg border transition-all hover:scale-[1.05] active:scale-95 cursor-pointer block"
              style={{
                background: s.bg,
                borderColor: `${s.color}40`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <s.icon size={14} style={{ color: s.color }} />
                <p
                  className="text-[10px] sm:text-xs font-medium truncate"
                  style={{ color: s.color }}
                >
                  {s.label}
                </p>
              </div>
              <p
                className="text-xl sm:text-2xl font-bold"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {getPercent(s.value)}%
              </p>
            </Link>
          ))}
        </div>

        {totalOrders > 0 && (
          <div className="space-y-3">
            <div
              className="h-3 rounded-full overflow-hidden flex"
              style={{ background: "var(--bg-primary)" }}
            >
              {statusStats.map((s) => {
                const percent = getPercent(s.value);
                if (percent === 0) return null;
                return (
                  <div
                    key={s.key}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      background: s.color,
                    }}
                    title={`${s.label}: ${percent}%`}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {statusStats.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs cursor-default"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="rounded-xl border overflow-hidden animate-fadeIn mb-6"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
          animationDelay: "300ms",
        }}
      >
        <div
          className="p-4 border-b flex items-center justify-between gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} style={{ color: "var(--accent)" }} />
            <h2
              className="font-bold text-base sm:text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {t("recentOrders")}
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs sm:text-sm flex items-center gap-1 transition-all hover:gap-2 cursor-pointer hover:scale-105"
            style={{ color: "var(--accent)" }}
          >
            {t("viewAll")} <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag
              size={32}
              className="mx-auto mb-2"
              style={{ color: "var(--text-secondary)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("noOrders")}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {orders.slice(0, 5).map((order) => {
              const status = order.status || "pending";
              const statusStyle =
                statusStats.find((s) => s.key === status) || statusStats[0];
              const StatusIcon = statusStyle.icon;

              return (
                <Link
                  key={order.id}
                  to="/admin/orders"
                  className="p-3 sm:p-4 flex items-center gap-3 hover:opacity-80 transition cursor-pointer hover:translate-x-1 block"
                >
                  <div className="flex -space-x-2 shrink-0">
                    {order.items.slice(0, 2).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt=""
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 object-cover"
                        style={{ borderColor: "var(--bg-secondary)" }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/50x50?text=?";
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs sm:text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.name}
                    </p>
                    <p
                      className="text-[10px] sm:text-xs font-mono truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {order.id}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {currency}
                      {order.total}
                    </p>
                    <div
                      className="flex items-center gap-1 justify-end mt-0.5"
                      style={{ color: statusStyle.color }}
                    >
                      <StatusIcon size={10} />
                      <span className="text-[10px] sm:text-xs capitalize font-medium">
                        {t(status)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {analytics && (
        <div
          className="rounded-xl border p-4 sm:p-5 animate-fadeIn"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            animationDelay: "400ms",
          }}
        >
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} style={{ color: "var(--accent)" }} />
              <h2
                className="font-bold text-base sm:text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {t("analytics")}
              </h2>
            </div>
            <button
              onClick={handleClearAnalytics}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-1"
              style={{
                background: "#ef444420",
                color: "#ef4444",
              }}
            >
              <Trash2 size={12} /> {t("clear")}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              {
                icon: Eye,
                label: t("pageViews"),
                value: analytics.totalPageViews,
                color: "#3b82f6",
              },
              {
                icon: MousePointer,
                label: t("sessions"),
                value: analytics.totalSessions,
                color: "#8b5cf6",
              },
              {
                icon: TrendingUp,
                label: t("events"),
                value: analytics.eventsCount,
                color: "#10b981",
              },
              {
                icon: BarChart3,
                label: t("uniquePages"),
                value: analytics.uniquePages,
                color: "#f59e0b",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg border"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: `${s.color}20` }}
                >
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <p
                  className="text-[10px] mb-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.label}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {analytics.topPages.length > 0 && (
            <div className="mb-5">
              <p
                className="text-xs font-bold mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("topPages")}
              </p>
              <div className="space-y-2">
                {analytics.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3 text-xs">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        background: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="flex-1 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.path}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {p.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics.topEvents.length > 0 && (
            <div>
              <p
                className="text-xs font-bold mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("topEvents")}
              </p>
              <div className="space-y-2">
                {analytics.topEvents.map((e, i) => (
                  <div key={e.name} className="flex items-center gap-3 text-xs">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        background: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="flex-1 capitalize"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {e.name.replace(/_/g, " ")}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {e.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics.totalPageViews === 0 && (
            <p
              className="text-xs text-center py-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("noAnalyticsData")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}