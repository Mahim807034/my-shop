import {
  Check,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../store/languageStore";

const STATUS_ORDER = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function OrderTimeline({ status }) {
  const { t } = useLanguage();

  const STEPS = [
    { key: "pending", label: t("pending"), icon: Clock },
    { key: "confirmed", label: t("confirmed"), icon: Check },
    { key: "shipped", label: t("shipped"), icon: Truck },
    { key: "delivered", label: t("delivered"), icon: CheckCircle },
  ];

  if (status === "cancelled") {
    return (
      <div
        className="p-4 rounded-xl flex items-center gap-3"
        style={{ background: "#ef444415" }}
      >
        <XCircle size={24} style={{ color: "#ef4444" }} />
        <div>
          <p className="font-bold text-sm" style={{ color: "#ef4444" }}>
            {t("cancelled")}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER[status || "pending"];

  return (
    <div
      className="p-4 sm:p-5 rounded-xl border"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="font-semibold mb-4 text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {t("status")}
      </p>

      {/* Desktop timeline */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div
          className="absolute top-5 left-0 right-0 h-1"
          style={{ background: "var(--bg-primary)" }}
        />
        <div
          className="absolute top-5 left-0 h-1 transition-all duration-700"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
            background: "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
          }}
        />

        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCurrent ? "ring-4 ring-opacity-30" : ""
                }`}
                style={{
                  background: done
                    ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                    : "var(--bg-primary)",
                  color: done ? "white" : "var(--text-secondary)",
                  boxShadow: isCurrent
                    ? "0 0 0 4px rgba(16, 185, 129, 0.2)"
                    : "none",
                }}
              >
                <Icon size={18} />
              </div>
              <p
                className="text-xs font-medium mt-2 text-center"
                style={{
                  color: done
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile vertical */}
      <div className="sm:hidden space-y-3">
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCurrent ? "ring-4 ring-opacity-30" : ""
                }`}
                style={{
                  background: done
                    ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                    : "var(--bg-primary)",
                  color: done ? "white" : "var(--text-secondary)",
                  boxShadow: isCurrent
                    ? "0 0 0 4px rgba(16, 185, 129, 0.2)"
                    : "none",
                }}
              >
                <Icon size={14} />
              </div>
              <div className="pt-1.5">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: done
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}