import { FileText } from "lucide-react";
import { useSettings } from "../store/settingsStore";
import { useLanguage } from "../store/languageStore";

const TERMS = {
  en: [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing and using {siteName}, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
    },
    {
      title: "2. Products and Pricing",
      body: "All product prices are displayed in Bangladeshi Taka (৳) and are subject to change without notice.",
    },
    {
      title: "3. Orders and Payment",
      body: "Orders are confirmed once payment is received or verified. We accept Cash on Delivery, bKash, Nagad, and cards.",
    },
    {
      title: "4. Delivery",
      body: "We deliver all over Bangladesh within 2-3 business days. Delivery charges apply unless otherwise stated.",
    },
    {
      title: "5. Returns and Refunds",
      body: "We offer a 7-day return policy for defective or incorrect products. Refunds are processed within 7-10 business days.",
    },
    {
      title: "6. User Account",
      body: "You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      title: "7. Privacy",
      body: "We respect your privacy. Please refer to our Privacy Policy for details.",
    },
    {
      title: "8. Limitation of Liability",
      body: "In no event shall {siteName} be liable for any indirect, incidental, or consequential damages.",
    },
    {
      title: "9. Changes to Terms",
      body: "We reserve the right to modify these terms at any time. Continued use means you accept the updated terms.",
    },
    {
      title: "10. Contact",
      body: "For questions about these Terms, contact us at {email} or {phone}.",
    },
  ],
  bn: [
    {
      title: "১. শর্তাবলী গ্রহণ",
      body: "{siteName} ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হয়েছেন। না সম্মত হলে আমাদের সেবা ব্যবহার করবেন না।",
    },
    {
      title: "২. পণ্য এবং মূল্য",
      body: "সব পণ্যের মূল্য বাংলাদেশি টাকায় (৳) দেখানো হয়েছে এবং নোটিশ ছাড়াই পরিবর্তনযোগ্য।",
    },
    {
      title: "৩. অর্ডার এবং পেমেন্ট",
      body: "পেমেন্ট পাওয়ার বা যাচাইয়ের পর অর্ডার নিশ্চিত হয়। ক্যাশ অন ডেলিভারি, bKash, Nagad ও কার্ড গ্রহণ করি।",
    },
    {
      title: "৪. ডেলিভারি",
      body: "সারা বাংলাদেশে ২-৩ কার্যদিবসে ডেলিভারি দিই। ডেলিভারি চার্জ প্রযোজ্য।",
    },
    {
      title: "৫. রিটার্ন এবং রিফান্ড",
      body: "ত্রুটিপূর্ণ বা ভুল পণ্যের জন্য ৭ দিনের রিটার্ন পলিসি। রিফান্ড ৭-১০ কার্যদিবসে প্রক্রিয়া হয়।",
    },
    {
      title: "৬. ব্যবহারকারী অ্যাকাউন্ট",
      body: "আপনার অ্যাকাউন্ট তথ্যের গোপনীয়তা রক্ষার দায়িত্ব আপনার।",
    },
    {
      title: "৭. গোপনীয়তা",
      body: "আমরা আপনার গোপনীয়তাকে সম্মান করি। বিস্তারিত জানতে গোপনীয়তা নীতি দেখুন।",
    },
    {
      title: "৮. দায়বদ্ধতার সীমা",
      body: "{siteName} কোনো পরোক্ষ ক্ষতির জন্য দায়ী নয়।",
    },
    {
      title: "৯. শর্তাবলীর পরিবর্তন",
      body: "যেকোনো সময় এই শর্তাবলী পরিবর্তনের অধিকার আমাদের আছে।",
    },
    {
      title: "১০. যোগাযোগ",
      body: "শর্তাবলী সম্পর্কে প্রশ্ন থাকলে যোগাযোগ করুন: {email} বা {phone}।",
    },
  ],
};

export default function Terms() {
  const settings = useSettings((s) => s.settings);
  const { t, lang } = useLanguage();

  const sections = (TERMS[lang] || TERMS.en).map((s) => ({
    title: s.title,
    body: s.body
      .replace(/{siteName}/g, settings.siteName)
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
            <FileText size={32} className="text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("termsTitle")}
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
            {t("termsIntro")}
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