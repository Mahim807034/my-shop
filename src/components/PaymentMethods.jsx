import { Banknote, CreditCard, Smartphone, Check } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function PaymentMethods({ selected, onChange }) {
  const { t } = useLanguage();

  const PAYMENT_METHODS = [
    {
      id: "cod",
      name: t("cashOnDelivery"),
      desc: t("payOnReceive"),
      icon: Banknote,
      color: "#10b981",
      available: true,
    },
    {
      id: "bkash",
      name: "bKash",
      desc: t("mobileBanking"),
      icon: Smartphone,
      color: "#e2136e",
      available: true,
    },
    {
      id: "nagad",
      name: "Nagad",
      desc: t("mobileBanking"),
      icon: Smartphone,
      color: "#f58220",
      available: true,
    },
    {
      id: "card",
      name: t("card"),
      desc: "Visa / Mastercard",
      icon: CreditCard,
      color: "#3b82f6",
      available: false,
    },
  ];

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-xs sm:text-sm font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t("paymentMethod")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((m) => {
          const isSelected = selected === m.id;
          const isDisabled = !m.available;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => !isDisabled && onChange(m.id)}
              disabled={isDisabled}
              className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                isSelected ? "scale-[1.02] shadow-lg" : "hover:scale-[1.01]"
              } ${
                isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{
                borderColor: isSelected ? m.color : "var(--border)",
                background: isSelected ? "var(--bg-primary)" : "transparent",
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center animate-scaleIn"
                  style={{ background: m.color }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
              )}

              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                style={{ background: `${m.color}20` }}
              >
                <m.icon size={18} style={{ color: m.color }} />
              </div>
              <p
                className="font-bold text-xs mb-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {m.name}
              </p>
              <p
                className="text-[10px] leading-snug"
                style={{ color: "var(--text-secondary)" }}
              >
                {m.desc}
              </p>
              {isDisabled && (
                <p
                  className="text-[9px] mt-1 italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("comingSoon")}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}