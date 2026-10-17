import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Package,
  Heart,
  Search,
} from "lucide-react";
import { useCart } from "../store/cartStore";
import { useTheme } from "../store/themeStore";
import { useAuth } from "../store/authStore";
import { useSettings } from "../store/settingsStore";
import { useWishlist } from "../store/wishlistStore";
import { useSiteContent } from "../store/siteContentStore";
import { useLanguage } from "../store/languageStore";
import SearchBar from "./SearchBar";
import LanguageSwitcher from "./LanguageSwitcher";

const SHADOW_MAP = {
  none: "none",
  subtle: "0 1px 2px rgba(0,0,0,0.05)",
  medium: "0 4px 6px rgba(0,0,0,0.1)",
  dramatic: "0 10px 25px rgba(0,0,0,0.2)",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount = useWishlist((s) => s.items.length);
  const { theme, toggleTheme, initTheme } = useTheme();
  const { user, logout } = useAuth();
  const settings = useSettings((s) => s.settings);
  const siteContent = useSiteContent((s) => s.content);
  const { t } = useLanguage();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    if (open || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);

  const navCfg = siteContent?.navbar || {};

  // 🎯 Translate menu items dynamically
  const links = navCfg.menuItems
    ? navCfg.menuItems.map((item) => {
        // Try to translate based on label
        const key = item.label.toLowerCase();
        const translation = t(key);
        return {
          ...item,
          label: translation !== key ? translation : item.label,
        };
      })
    : [
        { label: t("home"), to: "/" },
        { label: t("products"), to: "/products" },
        { label: t("about"), to: "/about" },
        { label: t("contact"), to: "/contact" },
      ];

  const showLogoImage = navCfg.showLogoImage && navCfg.logoImage;
  const logoText =
    navCfg.logoText || siteContent?.global?.siteName || settings.siteName;

  const showWishlist = navCfg.showWishlist !== false;
  const showCart = navCfg.showCart !== false;

  const isDark = theme === "dark";

  const navHeight = navCfg.height || 64;
  const bgColor = isDark
    ? navCfg.bgColorDark || "#0f1a14"
    : navCfg.bgColorLight || "#ffffff";
  const textColor = isDark
    ? navCfg.textColorDark || "#f0fdf4"
    : navCfg.textColorLight || "#0f172a";
  const logoColor = navCfg.logoColor || "var(--accent)";
  const shadow = SHADOW_MAP[navCfg.shadow || "subtle"];
  const sticky = navCfg.sticky !== false;
  const borderBottom = navCfg.borderBottom !== false;
  const blur = navCfg.blur !== false;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`${sticky ? "sticky top-0" : ""} z-50 animate-slideIn`}
      style={{
        background: bgColor,
        borderBottom: borderBottom ? "1px solid var(--border)" : "none",
        boxShadow: shadow,
        backdropFilter: blur ? "blur(12px)" : "none",
        WebkitBackdropFilter: blur ? "blur(12px)" : "none",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-2"
        style={{ height: `${navHeight}px` }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-base sm:text-lg md:text-xl font-bold transition-transform hover:scale-105 shrink-0 select-none cursor-pointer flex items-center gap-2"
          style={{ color: logoColor }}
        >
          {showLogoImage ? (
            <img
              src={navCfg.logoImage}
              alt={logoText}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            logoText
          )}
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 lg:gap-8">
          {links.map((l, i) => (
            <li key={i}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `transition-all duration-200 hover:scale-105 text-sm lg:text-base cursor-pointer ${
                    isActive ? "font-semibold" : ""
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? logoColor : textColor,
                })}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Search */}
        <div className="hidden lg:block flex-1 max-w-xs mx-2">
          <SearchBar />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{ background: "var(--bg-primary)" }}
            aria-label={t("search")}
          >
            <Search size={18} style={{ color: "var(--text-primary)" }} />
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{ background: "var(--bg-primary)" }}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={18} style={{ color: "var(--text-primary)" }} />
            ) : (
              <Sun size={18} style={{ color: "var(--accent)" }} />
            )}
          </button>

          {/* Wishlist */}
          {showWishlist && (
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ background: "var(--bg-primary)" }}
              aria-label={t("wishlist")}
            >
              <Heart size={18} style={{ color: "#ef4444" }} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-scaleIn font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          {showCart && (
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{ background: "var(--bg-primary)" }}
              aria-label={t("cart")}
            >
              <ShoppingCart size={18} style={{ color: "var(--text-primary)" }} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-scaleIn font-bold">
                  {count}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div className="relative hidden md:block user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full transition-all hover:scale-105 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-white text-sm font-medium hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden animate-scaleIn"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="px-4 py-3 border-b flex items-center gap-3"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 text-sm transition-all hover:pl-5 cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <User size={14} /> {t("profile")}
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 text-sm transition-all hover:pl-5 cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Package size={14} /> {t("orders")}
                  </Link>

                  {showWishlist && (
                    <Link
                      to="/wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 text-sm transition-all hover:pl-5 cursor-pointer"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <Heart size={14} /> {t("wishlist")}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 text-sm text-red-500 transition-all border-t hover:pl-5 cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <LogOut size={14} /> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 lg:px-4 py-2 text-sm font-medium rounded-full transition-all hover:scale-105 cursor-pointer"
                style={{ color: textColor }}
              >
                {t("login")}
              </Link>
              <Link
                to="/signup"
                className="px-3 lg:px-4 py-2 text-sm font-medium text-white rounded-full transition-all hover:scale-105 shadow-md whitespace-nowrap cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                {t("signup")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg transition hover:scale-110 cursor-pointer"
            style={{ color: textColor }}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden animate-fadeIn"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="absolute top-0 left-0 right-0 p-4 animate-slideIn"
            style={{ background: "var(--bg-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar isMobile autoFocus onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden border-t animate-slideIn max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{ background: bgColor, borderColor: "var(--border)" }}
        >
          <ul className="px-3 sm:px-4 py-3 space-y-1">
            {links.map((l, i) => (
              <li key={i}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 px-3 rounded-lg transition text-sm sm:text-base cursor-pointer ${
                      isActive ? "font-semibold" : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? logoColor : textColor,
                    background: isActive ? "var(--bg-primary)" : "transparent",
                  })}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}

            {showWishlist && (
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg transition text-sm cursor-pointer"
                  style={{ color: textColor }}
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} style={{ color: "#ef4444" }} /> {t("wishlist")}
                  </span>
                  {wishlistCount > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white font-bold"
                      style={{ background: "#ef4444" }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            <li
              className="pt-3 mt-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition text-sm cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <User size={18} /> {t("profile")}
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition text-sm cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Package size={18} /> {t("orders")}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-sm font-medium text-red-500 border border-red-500 rounded-full flex items-center justify-center gap-2 transition-all hover:bg-red-500 hover:text-white mt-2 cursor-pointer"
                  >
                    <LogOut size={16} /> {t("logout")}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium rounded-full border transition-all cursor-pointer"
                    style={{ color: textColor, borderColor: "var(--border)" }}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-white rounded-full transition-all cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    }}
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}