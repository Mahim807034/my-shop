import { Shield } from "lucide-react";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";

const PRIVACY = {
  en: [
    {
      title: "1. Information We Collect",
      body: "We collect information you provide directly: name, email, phone, delivery address, and payment information.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use your information to process orders, deliver products, provide customer support, and improve our services.",
    },
    {
      title: "3. Information Sharing",
      body: "We do not sell your personal information. We may share information with delivery partners and payment processors.",
    },
    {
      title: "4. Data Security",
      body: "We implement industry-standard security measures to protect your data.",
    },
    {
      title: "5. Cookies",
      body: "We use cookies to remember your preferences and analyze site traffic.",
    },
    {
      title: "6. Your Rights",
      body: "You have the right to access, update, or delete your personal information.",
    },
    {
      title: "7. Children's Privacy",
      body: "Our services are not intended for children under 13.",
    },
    {
      title: "8. Data Retention",
      body: "We retain your information as long as your account is active.",
    },
    {
      title: "9. Changes to Privacy Policy",
      body: "We may update this policy periodically.",
    },
    {
      title: "10. Contact Us",
      body: "For privacy questions, contact us at {email} or {phone}.",
    },
  ],
  bn: [
    {
      title: "১. আমরা যে তথ্য সংগ্রহ করি",
      body: "আপনি সরাসরি যে তথ্য দেন: নাম, ইমেইল, ফোন, ডেলিভারি ঠিকানা এবং পেমেন্ট তথ্য।",
    },
    {
      title: "২. তথ্য কীভাবে ব্যবহার করি",
      body: "অর্ডার প্রক্রিয়া, পণ্য ডেলিভারি, গ্রাহক সহায়তা এবং সেবা উন্নত করতে ব্যবহার করি।",
    },
    {
      title: "৩. তথ্য শেয়ার",
      body: "আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। ডেলিভারি পার্টনার ও পেমেন্ট প্রসেসরের সাথে শেয়ার করি।",
    },
    {
      title: "৪. ডেটা নিরাপত্তা",
      body: "আপনার ডেটা রক্ষায় শিল্প-মানের নিরাপত্তা ব্যবস্থা গ্রহণ করি।",
    },
    {
      title: "৫. কুকিজ",
      body: "আপনার পছন্দ মনে রাখতে এবং সাইট ট্রাফিক বিশ্লেষণ করতে কুকিজ ব্যবহার করি।",
    },
    {
      title: "৬. আপনার অধিকার",
      body: "আপনার ব্যক্তিগত তথ্য দেখতে, আপডেট বা মুছে ফেলার অধিকার আছে।",
    },
    {
      title: "৭. শিশুদের গোপনীয়তা",
      body: "আমাদের সেবা ১৩ বছরের কম বয়সীদের জন্য নয়।",
    },
    {
      title: "৮. ডেটা সংরক্ষণ",
      body: "আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত তথ্য সংরক্ষণ করি।",
    },
    {
      title: "৯. গোপনীয়তা নীতি পরিবর্তন",
      body: "সময় সময় এই নীতি আপডেট করতে পারি।",
    },
    {
      title: "১০. যোগাযোগ",
      body: "গোপনীয়তা সংক্রান্ত প্রশ্নে যোগাযোগ করুন: {email} বা {phone}।",
    },
  ],
};

export default function Privacy() {
  const settings = useSettings((s) => s.settings);
  const { t, lang } = useLanguage();

  const sections = (PRIVACY[lang] || PRIVACY.en).map((s) => ({
    title: s.title,
    body: s.body
      .replace(/{email}/g, settings.email)
      .replace(/{phone}/g, settings.phone),
  }));

  return (
    <div
      className="min-h-[calc(100vh-4rem)] py-10 px-4 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            <Shield size={32} className="text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("privacyTitle")}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("lastUpdated")}:{" "}
            {new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div
          className="rounded-2xl border p-6 sm:p-8 space-y-6"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="leading-relaxed text-sm sm:text-base pb-4 border-b"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border)",
            }}
          >
            {t("privacyIntro")}
          </p>

          {sections.map((s, i) => (
            <div
              key={i}
              className="animate-fadeIn"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h2
                className="font-bold mb-2 text-base sm:text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {s.title}
              </h2>
              <p
                className="leading-relaxed text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}