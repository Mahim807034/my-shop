import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function Contact() {
  const settings = useSettings((s) => s.settings);
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(refs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (name) => (el) => {
    refs.current[name] = el;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      const text = `New Message:%0A%0AName: ${form.name}%0APhone: ${form.phone}%0A%0A${form.message}`;
      window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, "_blank");

      toast.success("Opening WhatsApp...");
      setForm({ name: "", phone: "", message: "" });
      setSending(false);
    }, 500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("phone"),
      value: settings.phone || "+880 1XXX-XXXXXX",
      href: settings.phone
        ? `tel:${settings.phone.replace(/\s/g, "")}`
        : null,
      color: "#3b82f6",
    },
    {
      icon: Mail,
      title: t("email"),
      value: settings.email || "info@myshop.com",
      href: settings.email ? `mailto:${settings.email}` : null,
      color: "#8b5cf6",
    },
    {
      icon: MapPin,
      title: t("address"),
      value: settings.address || "Dhaka, Bangladesh",
      href: null,
      color: "#ef4444",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Chat",
      href: settings.whatsapp
        ? `https://wa.me/${settings.whatsapp}`
        : null,
      color: "#10b981",
    },
  ];

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden py-14 sm:py-20 md:py-24 px-4"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 sm:w-72 h-40 sm:h-72 rounded-full bg-white blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-10 right-10 w-52 sm:w-96 h-52 sm:h-96 rounded-full bg-white blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 text-white animate-fadeIn">
            {t("contact")}
          </h1>
          <p
            className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fadeIn px-2"
            style={{ animationDelay: "0.2s" }}
          >
            {t("contactMessage") || "We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {contactInfo.map((c, i) => {
            const Card = c.href ? "a" : "div";
            return (
              <Card
                key={c.title}
                href={c.href}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  c.href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
                ref={setRef(`info-${i}`)}
                data-section={`info-${i}`}
                className={`block p-3 sm:p-5 rounded-xl sm:rounded-2xl border shadow-lg text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group ${
                  c.href ? "cursor-pointer" : ""
                } ${
                  visibleSections[`info-${i}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: `${c.color}20` }}
                >
                  <c.icon
                    size={20}
                    className="sm:hidden"
                    style={{ color: c.color }}
                  />
                  <c.icon
                    size={22}
                    className="hidden sm:block"
                    style={{ color: c.color }}
                  />
                </div>
                <p
                  className="font-bold mb-0.5 sm:mb-1 text-xs sm:text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {c.title}
                </p>
                <p
                  className="text-[10px] sm:text-xs md:text-sm truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {c.value}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {/* Left */}
          <div
            ref={setRef("left")}
            data-section="left"
            className={`transition-all duration-700 ${
              visibleSections.left
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {t("getInTouch") || "Get in Touch"}
            </h2>
            <p
              className="mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("contactDesc") ||
                "Have a question about a product? Need help with your order? We're here for you."}
            </p>

            <div className="space-y-3 sm:space-y-4">
              <InfoBlock
                icon={Clock}
                title={t("businessHours") || "Business Hours"}
                lines={["Sat - Thu: 10 AM - 9 PM"]}
              />
              <InfoBlock
                icon={MessageCircle}
                title={t("quickResponse") || "Quick Response"}
                lines={["WhatsApp: Instant", "Email: Within 24h"]}
              />
              <InfoBlock
                icon={CheckCircle}
                title={t("wePromise") || "We Promise"}
                lines={["100% satisfaction"]}
              />
            </div>
          </div>

          {/* Form */}
          <div
            ref={setRef("form")}
            data-section="form"
            className={`p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border shadow-lg transition-all duration-700 ${
              visibleSections.form
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <h3
              className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {t("sendMessage") || "Send a Message"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("note")}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={4}
                  className="w-full border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base"
                  style={inputStyle}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 sm:py-3 text-white rounded-lg sm:rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 text-sm sm:text-base cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                {sending ? (
                  t("loading")
                ) : (
                  <>
                    <Send size={16} className="sm:hidden" />
                    <Send size={18} className="hidden sm:block" /> WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, lines }) {
  return (
    <div
      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all hover:translate-x-2"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-primary)" }}
      >
        <Icon
          size={16}
          className="sm:hidden"
          style={{ color: "var(--accent)" }}
        />
        <Icon
          size={18}
          className="hidden sm:block"
          style={{ color: "var(--accent)" }}
        />
      </div>
      <div className="min-w-0">
        <p
          className="font-bold mb-0.5 sm:mb-1 text-sm sm:text-base"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        {lines.map((line) => (
          <p
            key={line}
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}