import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
  Shield,
  Palette,
  FileText,
} from "lucide-react";
import { useAdmin } from "../store/adminStore";
import { useAuth } from "../store/authStore";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { username, email, logout: adminLogout } = useAdmin();
  const { user, logout: authLogout } = useAuth();
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    adminLogout();
    authLogout();
    toast.success(`✓ ${t("logout")}`);
    navigate("/login");
  };

  const navItems = [
    {
      to: "/admin",
      label: t("dashboard"),
      icon: LayoutDashboard,
      end: true,
    },
    { to: "/admin/products", label: t("productsAdmin"), icon: Package },
    { to: "/admin/orders", label: t("ordersAdmin"), icon: ShoppingBag },
    { to: "/admin/content", label: t("contentAdmin"), icon: FileText },
    {
      to: "/admin/appearance",
      label: t("appearanceAdmin"),
      icon: Palette,
    },
    { to: "/admin/settings", label: t("settingsAdmin"), icon: Settings },
  ];

  const displayName = username || user?.name || "Admin";
  const displayEmail = email || user?.email || "";

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 border-r transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            to="/admin"
            className="flex items-center gap-2 font-bold text-lg cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            <Store size={22} />
            {t("adminPanel")}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition hover:scale-110 active:scale-95 cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
                  isActive ? "shadow-md" : "hover:translate-x-1"
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "white" : "var(--text-primary)",
              })}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="p-3 border-t space-y-2 shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="px-3 py-2.5 rounded-lg"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "var(--accent)" }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <p
                className="text-xs font-semibold truncate flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {displayName}
              </p>
            </div>
            {displayEmail && (
              <p
                className="text-[10px] truncate ml-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {displayEmail}
              </p>
            )}
            <div className="flex items-center gap-1 ml-8 mt-1">
              <Shield size={10} style={{ color: "var(--accent)" }} />
              <span
                className="text-[10px] font-medium"
                style={{ color: "var(--accent)" }}
              >
                {t("administrator")}
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all hover:translate-x-1 cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <Store size={16} /> {t("viewStore")}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 transition-all hover:bg-red-500 hover:text-white cursor-pointer"
          >
            <LogOut size={16} /> {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <header
          className="lg:hidden sticky top-0 z-30 border-b px-4 h-14 flex items-center gap-3 shrink-0"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg transition hover:scale-110 cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <Menu size={20} />
          </button>
          <h1
            className="font-bold text-sm flex-1"
            style={{ color: "var(--accent)" }}
          >
            {t("adminPanel")}
          </h1>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "var(--accent)" }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}