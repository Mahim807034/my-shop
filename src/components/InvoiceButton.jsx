import { useState } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import { generateOrderPDF } from "../utils/pdfGenerator";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function InvoiceButton({ order, variant = "default" }) {
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    try {
      generateOrderPDF(order, settings);
      toast.success("📄");
    } catch (error) {
      console.error(error);
      toast.error("PDF failed");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handlePrint = () => {
    setLoading(true);
    try {
      generateOrderPDF(order, settings);
      toast.success("🖨️");
    } catch (error) {
      console.error(error);
      toast.error("PDF failed");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        className="p-2.5 rounded-lg border transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50"
        style={{
          borderColor: "var(--border)",
          color: "#10b981",
        }}
        title={t("downloadInvoice")}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {t("loading")}
          </>
        ) : (
          <>
            <Download size={14} />
            {t("downloadInvoice")}
          </>
        )}
      </button>
      <button
        onClick={handlePrint}
        disabled={loading}
        className="py-2.5 px-4 rounded-lg font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        style={{
          borderColor: "var(--accent)",
          color: "var(--accent)",
        }}
        title={t("printInvoice")}
      >
        <Printer size={14} />
      </button>
    </div>
  );
}