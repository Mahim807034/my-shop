import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fadeIn relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10 animate-pulse-slow"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse-slow"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
            animationDelay: "1.5s",
          }}
        />
      </div>

      <div className="w-full max-w-lg text-center relative z-10">
        <div className="relative mb-6">
          <h1
            className="text-[100px] sm:text-[160px] md:text-[200px] font-black leading-none select-none"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>

          <div
            className="absolute top-4 -left-4 w-8 h-8 rounded-lg rotate-12 animate-float"
            style={{
              background:
                "linear-gradient(135deg, #10b98140 0%, #3b82f640 100%)",
            }}
          />
          <div
            className="absolute bottom-4 -right-4 w-12 h-12 rounded-full animate-float"
            style={{
              background:
                "linear-gradient(135deg, #3b82f640 0%, #10b98140 100%)",
              animationDelay: "1s",
            }}
          />
        </div>

        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        >
          <Compass size={32} className="text-white" />
        </div>

        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {t("pageNotFound")}
        </h2>
        <p
          className="mb-8 text-sm sm:text-base max-w-md mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("pageNotFoundDesc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
            style={{
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          >
            <ArrowLeft size={16} /> {t("goBack")}
          </button>
          <Link
            to="/"
            className="px-5 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg cursor-pointer text-sm"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            <Home size={16} /> {t("home")}
          </Link>
          <Link
            to="/products"
            className="px-5 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
            style={{
              color: "var(--accent)",
              borderColor: "var(--accent)",
            }}
          >
            <Search size={16} /> {t("browse")}
          </Link>
        </div>

        <div
          className="p-5 rounded-2xl border"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-xs font-bold mb-3 uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("popularPages")}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: t("products"), to: "/products" },
              { label: t("about"), to: "/about" },
              { label: t("contact"), to: "/contact" },
              { label: t("faq"), to: "/faq" },
              { label: t("cart"), to: "/cart" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}