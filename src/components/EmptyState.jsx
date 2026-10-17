import {
  ShoppingBag,
  Heart,
  Package,
  Search,
  FileQuestion,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../store/languageStore";

const EMPTY_STATES = {
  cart: {
    icon: ShoppingBag,
    titleKey: "emptyCart",
    descKey: "emptyCartMessage",
    actionKey: "startShopping",
    actionLink: "/products",
    color: "#10b981",
  },
  wishlist: {
    icon: Heart,
    titleKey: "noProducts",
    descKey: "noProducts",
    actionKey: "startShopping",
    actionLink: "/products",
    color: "#ef4444",
  },
  orders: {
    icon: Package,
    titleKey: "noOrders",
    descKey: "noOrdersMessage",
    actionKey: "shopNow",
    actionLink: "/products",
    color: "#3b82f6",
  },
  search: {
    icon: Search,
    titleKey: "noProductsFound",
    descKey: "noProductsFound",
    actionKey: "clearFilters",
    actionLink: "/products",
    color: "#f59e0b",
  },
  notFound: {
    icon: FileQuestion,
    titleKey: "noProducts",
    descKey: "noProducts",
    actionKey: "back",
    actionLink: "/",
    color: "#8b5cf6",
  },
};

export default function EmptyState({
  type = "cart",
  customTitle = null,
  customDescription = null,
  customAction = null,
  customActionLink = null,
}) {
  const { t } = useLanguage();
  const config = EMPTY_STATES[type] || EMPTY_STATES.cart;
  const Icon = config.icon;

  return (
    <div className="text-center py-16 sm:py-20 px-4 animate-fadeIn">
      <div className="relative inline-block mb-6">
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${config.color}20 0%, ${config.color}10 100%)`,
            border: `2px solid ${config.color}40`,
          }}
        >
          <Icon
            size={48}
            style={{ color: config.color }}
            className="sm:hidden"
            strokeWidth={1.5}
          />
          <Icon
            size={64}
            style={{ color: config.color }}
            className="hidden sm:block"
            strokeWidth={1.5}
          />
        </div>

        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-float"
          style={{ background: `${config.color}40` }}
        />
        <div
          className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-float"
          style={{
            background: `${config.color}60`,
            animationDelay: "0.5s",
          }}
        />
      </div>

      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {customTitle || t(config.titleKey)}
      </h2>

      <p
        className="text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {customDescription || t(config.descKey)}
      </p>

      {customAction ? (
        customAction
      ) : (
        <Link
          to={customActionLink || config.actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer text-sm sm:text-base"
          style={{
            background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
          }}
        >
          {t(config.actionKey)}
        </Link>
      )}
    </div>
  );
}