import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function Breadcrumbs({ customItems = null }) {
  const location = useLocation();
  const { t } = useLanguage();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [{ label: t("home"), to: "/" }];

    let currentPath = "";
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;

      let label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Translate known routes
      const routeMap = {
        products: t("products"),
        cart: t("cart"),
        checkout: t("checkout"),
        profile: t("profile"),
        orders: t("orders"),
        wishlist: t("wishlist"),
        about: t("about"),
        contact: t("contact"),
        faq: t("faq"),
        terms: t("terms"),
        privacy: t("privacy"),
        login: t("login"),
        signup: t("signup"),
        "forgot-password": t("forgotPassword"),
      };

      if (routeMap[segment]) {
        label = routeMap[segment];
      }

      if (index > 0 && pathnames[index - 1] === "product") {
        label = t("productDetails");
      }

      crumbs.push({ label, to: currentPath });
    });

    return crumbs;
  };

  const crumbs = customItems || generateBreadcrumbs();

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 sm:mb-6 overflow-x-auto scrollbar-hide"
    >
      <ol className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  size={12}
                  className="shrink-0"
                  style={{ color: "var(--text-secondary)" }}
                />
              )}

              {index === 0 ? (
                <Link
                  to={crumb.to}
                  className="flex items-center gap-1.5 transition hover:opacity-80 px-1 rounded cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label={t("home")}
                >
                  <Home size={12} />
                  <span className="hidden sm:inline">{crumb.label}</span>
                </Link>
              ) : isLast ? (
                <span
                  className="font-semibold px-1 max-w-[200px] truncate"
                  style={{ color: "var(--text-primary)" }}
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="transition hover:opacity-80 px-1 rounded cursor-pointer max-w-[150px] truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}