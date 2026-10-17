import { useState } from "react";
import { Share2, MessageCircle, Copy, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";

export default function ShareOrderButton({ order, variant = "default" }) {
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const currency = settings?.currency || "৳";
  const siteName = settings?.siteName || "My Shop";

  const handleShare = () => setShowModal(true);

  const getMessage = () => {
    const itemList = order.items
      .slice(0, 3)
      .map((i) => `• ${i.name} x${i.quantity}`)
      .join("\n");

    const more =
      order.items.length > 3
        ? `\n+ ${order.items.length - 3} ${t("moreItems")}`
        : "";

    return `🛍️ ${siteName}!\n\n📦 ${t("orderId")}: ${order.id}\n\n${itemList}${more}\n\n💰 ${t("total")}: ${currency}${order.total}\n━━━━━━━━━━━━━━━━`;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getMessage())}`;
    window.open(url, "_blank");
    toast.success("WhatsApp...");
    setShowModal(false);
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.origin
    )}`;
    window.open(url, "_blank");
    toast.success("Facebook...");
    setShowModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMessage());
    setCopied(true);
    toast.success("✓");
    setTimeout(() => {
      setCopied(false);
      setShowModal(false);
    }, 1500);
  };

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-lg border transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{
            borderColor: "var(--border)",
            color: "#3b82f6",
          }}
          title={t("share")}
        >
          <Share2 size={16} />
        </button>

        {showModal && (
          <ShareModal
            onClose={() => setShowModal(false)}
            handleWhatsApp={handleWhatsApp}
            handleFacebook={handleFacebook}
            handleCopy={handleCopy}
            copied={copied}
            t={t}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="flex-1 py-2.5 px-4 rounded-lg font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
        style={{
          borderColor: "#3b82f6",
          color: "#3b82f6",
        }}
      >
        <Share2 size={14} /> {t("share")}
      </button>

      {showModal && (
        <ShareModal
          onClose={() => setShowModal(false)}
          handleWhatsApp={handleWhatsApp}
          handleFacebook={handleFacebook}
          handleCopy={handleCopy}
          copied={copied}
          t={t}
        />
      )}
    </>
  );
}

function ShareModal({
  onClose,
  handleWhatsApp,
  handleFacebook,
  handleCopy,
  copied,
  t,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scaleIn"
        style={{ background: "var(--bg-secondary)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t("share")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg cursor-pointer hover:scale-110"
            style={{ color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: "#10b98120", color: "#10b981" }}
          >
            <MessageCircle size={20} />
            <span className="font-semibold text-sm">WhatsApp</span>
          </button>

          <button
            onClick={handleFacebook}
            className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: "#3b82f620", color: "#3b82f6" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-semibold text-sm">Facebook</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            <span className="font-semibold text-sm">
              {copied ? "✓" : t("copyLink")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}