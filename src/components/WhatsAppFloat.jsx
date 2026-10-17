import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSettings } from "../store/settingsStore";

/* 🎯 Floating WhatsApp button — bottom left */
export default function WhatsAppFloat() {
  const settings = useSettings((s) => s.settings);
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsapp = settings?.whatsapp;

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) {
      // Show tooltip after appearing
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 500);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [visible]);

  if (!whatsapp || !visible) return null;

  const handleClick = () => {
    const msg = "Hi! I have a question about your products.";
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-end gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="hidden sm:block mb-2 px-4 py-2 rounded-xl shadow-xl animate-slideUpFade relative"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition hover:scale-110"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
            aria-label="Close tooltip"
          >
            <X size={10} />
          </button>
          <p
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "var(--text-primary)" }}
          >
            Need help? Chat with us! 💬
          </p>
          <div
            className="absolute -bottom-1 left-4 w-2 h-2 rotate-45"
            style={{
              background: "var(--bg-secondary)",
              borderRight: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          />
        </div>
      )}

      {/* WhatsApp button */}
      <button
        onClick={handleClick}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer group animate-bounceIn"
        style={{
          background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
          color: "white",
        }}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Ping animation */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
          style={{ background: "#25d366" }}
        />
        
        {/* Icon */}
        <MessageCircle
          size={26}
          className="relative z-10 group-hover:rotate-12 transition-transform"
        />

        {/* Online dot */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2"
          style={{
            background: "#10b981",
            borderColor: "var(--bg-secondary)",
          }}
        />
      </button>
    </div>
  );
}