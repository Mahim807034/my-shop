import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("shop-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      "shop-cookie-consent",
      JSON.stringify({
        accepted: true,
        acceptedAt: new Date().toISOString(),
        type: "all",
      })
    );
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem(
      "shop-cookie-consent",
      JSON.stringify({
        accepted: false,
        acceptedAt: new Date().toISOString(),
        type: "essential-only",
      })
    );
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-slideUpFade"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="rounded-2xl border-2 shadow-2xl p-4 sm:p-5"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            <Cookie size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3
              className="font-bold text-sm mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {t("cookieTitle")}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("cookieMessage")}
            </p>
          </div>
          <button
            onClick={handleReject}
            className="p-1 rounded-lg hover:scale-110 transition cursor-pointer shrink-0"
            style={{ color: "var(--text-secondary)" }}
            aria-label={t("close")}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 rounded-lg font-semibold border-2 transition hover:scale-[1.02] active:scale-95 text-xs cursor-pointer"
            style={{
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          >
            {t("reject")}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-lg font-semibold text-white transition hover:scale-[1.02] active:scale-95 shadow-md text-xs cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {t("accept")}
          </button>
        </div>

        <p
          className="text-[10px] text-center mt-3"
          style={{ color: "var(--text-secondary)" }}
        >
          <a
            href="/privacy"
            className="font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {t("privacyPolicy")}
          </a>
        </p>
      </div>
    </div>
  );
}