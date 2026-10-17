import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "../store/languageStore";

const FAQS = {
  en: [
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 2-3 business days all over Bangladesh. Inside Dhaka it's often next day.",
    },
    {
      q: "What are the delivery charges?",
      a: "Delivery charge is ৳60 across Bangladesh. Free delivery on orders above ৳2000.",
    },
    {
      q: "Can I return a product?",
      a: "Yes! We offer 7-day return policy. If you're not satisfied, just contact us within 7 days.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery, bKash, Nagad, and Card payments (coming soon).",
    },
    {
      q: "How can I track my order?",
      a: "Login and go to 'My Orders' to see real-time status. You can also contact us on WhatsApp.",
    },
    {
      q: "Do you offer bulk discounts?",
      a: "Yes! Buy 3+ items get 5% off, 5+ get 10% off, 10+ get 15% off automatically.",
    },
    {
      q: "Is my payment information secure?",
      a: "Yes, all payments are processed through secure encrypted connections.",
    },
    {
      q: "How do I contact customer support?",
      a: "You can reach us via WhatsApp, phone, or email. We respond within 24 hours.",
    },
  ],
  bn: [
    {
      q: "ডেলিভারি কত দিন লাগে?",
      a: "সাধারণত সারা বাংলাদেশে ২-৩ কার্যদিবস লাগে। ঢাকার ভিতরে প্রায়ই পরদিনই পৌঁছে যায়।",
    },
    {
      q: "ডেলিভারি চার্জ কত?",
      a: "সারা বাংলাদেশে ডেলিভারি চার্জ ৳৬০। ৳২০০০ এর বেশি অর্ডারে ফ্রি ডেলিভারি।",
    },
    {
      q: "আমি কি পণ্য ফেরত দিতে পারব?",
      a: "হ্যাঁ! আমাদের ৭ দিনের রিটার্ন পলিসি আছে। সন্তুষ্ট না হলে ৭ দিনের মধ্যে যোগাযোগ করুন।",
    },
    {
      q: "কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?",
      a: "ক্যাশ অন ডেলিভারি, bKash, Nagad এবং কার্ড (শীঘ্রই আসছে) গ্রহণ করি।",
    },
    {
      q: "আমি কীভাবে আমার অর্ডার ট্র্যাক করব?",
      a: "লগইন করে 'আমার অর্ডার' এ যান। WhatsApp এও যোগাযোগ করতে পারেন।",
    },
    {
      q: "বাল্ক অর্ডারে ছাড় আছে?",
      a: "হ্যাঁ! ৩+ আইটেমে ৫% ছাড়, ৫+ এ ১০% ছাড়, ১০+ এ ১৫% ছাড় স্বয়ংক্রিয়ভাবে।",
    },
    {
      q: "আমার পেমেন্ট তথ্য কি নিরাপদ?",
      a: "হ্যাঁ, সব পেমেন্ট নিরাপদ এনক্রিপ্টেড সংযোগের মাধ্যমে সম্পন্ন হয়।",
    },
    {
      q: "গ্রাহক সহায়তায় কীভাবে যোগাযোগ করব?",
      a: "WhatsApp, ফোন বা ইমেইলে যোগাযোগ করতে পারেন। ২৪ ঘণ্টার মধ্যে উত্তর দিই।",
    },
  ],
};

export default function FAQ() {
  const { t, lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = FAQS[lang] || FAQS.en;

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
            <HelpCircle size={32} className="text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {t("faqTitle")}
          </h1>
          <p
            className="max-w-lg mx-auto text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("faqSubtitle")}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all animate-fadeIn"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: isOpen ? "var(--accent)" : "var(--border)",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer transition"
                >
                  <span
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 transition-transform duration-300"
                    style={{
                      color: "var(--accent)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="px-4 sm:px-5 pb-4 sm:pb-5 animate-fadeIn"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div
                      className="pt-3 border-t text-sm leading-relaxed"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="mt-10 p-6 rounded-2xl text-center"
          style={{ background: "var(--bg-secondary)" }}
        >
          <h3
            className="font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {t("stillHaveQuestions")}
          </h3>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("faqContactMsg")}
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </div>
  );
}