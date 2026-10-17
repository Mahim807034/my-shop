import { useEffect, useRef, useState } from "react";
import { Users, Target, Eye, Heart, Award, TrendingUp } from "lucide-react";
import { useLanguage } from "../store/languageStore";

export default function About() {
  const { t } = useLanguage();
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

  const stats = [
    { value: "10K+", label: t("happyCustomers") || "Happy Customers", icon: Users },
    { value: "500+", label: t("products"), icon: Award },
    { value: "5+", label: t("years") || "Years", icon: TrendingUp },
    { value: "99%", label: t("satisfaction") || "Satisfaction", icon: Heart },
  ];

  const values = [
    {
      icon: Target,
      title: t("ourMission") || "Our Mission",
      desc:
        t("ourMissionDesc") ||
        "Make quality products accessible to everyone in Bangladesh at fair prices.",
    },
    {
      icon: Eye,
      title: t("ourVision") || "Our Vision",
      desc:
        t("ourVisionDesc") ||
        "Become the most trusted online shop in Bangladesh with unmatched service.",
    },
    {
      icon: Heart,
      title: t("ourValues") || "Our Values",
      desc:
        t("ourValuesDesc") ||
        "Honesty, quality, and customer-first approach in everything we do.",
    },
  ];

  return (
    <div
      className="min-h-[calc(100vh-4rem)] animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden py-14 sm:py-20 md:py-28 px-4"
        style={{
          background:
            "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
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
            {t("aboutUs")}
          </h1>
          <p
            className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fadeIn px-2"
            style={{ animationDelay: "0.2s" }}
          >
            {t("welcomeSubtitle")}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              ref={setRef(`stat-${i}`)}
              data-section={`stat-${i}`}
              className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border shadow-lg text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                visibleSections[`stat-${i}`]
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
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-transform hover:scale-110"
                style={{ background: "var(--bg-primary)" }}
              >
                <s.icon
                  size={20}
                  className="sm:hidden"
                  style={{ color: "var(--accent)" }}
                />
                <s.icon
                  size={22}
                  className="hidden sm:block"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <p
                className="text-lg sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {s.value}
              </p>
              <p
                className="text-[10px] sm:text-xs md:text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div
          ref={setRef("story")}
          data-section="story"
          className={`rounded-xl sm:rounded-2xl border p-5 sm:p-8 md:p-10 transition-all duration-700 ${
            visibleSections.story
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3"
            style={{ color: "var(--text-primary)" }}
          >
            <span
              className="w-1 h-6 sm:h-8 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            ></span>
            {t("ourStory") || "Our Story"}
          </h2>

          <div
            className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <p>{t("story1") || "We started our journey with a simple mission — to make quality products accessible to everyone in Bangladesh at fair prices."}</p>
            <p>{t("story2") || "Today, we serve thousands of happy customers and continue to grow every day. Every product we sell is carefully selected to ensure the best quality."}</p>
            <p>{t("story3") || "From humble beginnings to becoming a trusted name in online shopping, our commitment to excellence has never wavered."}</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-6xl mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          {t("whatDrivesUs") || "What Drives Us"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              ref={setRef(`value-${i}`)}
              data-section={`value-${i}`}
              className={`p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group ${
                visibleSections[`value-${i}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <v.icon size={24} className="sm:hidden text-white" />
                <v.icon size={28} className="hidden sm:block text-white" />
              </div>
              <h3
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {v.title}
              </h3>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-12 sm:pb-20">
        <div
          ref={setRef("cta")}
          data-section="cta"
          className={`rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-700 ${
            visibleSections.cta
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-white">
            {t("readyToShop")}
          </h2>
          <p className="text-white/90 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
            {t("browseCollection")}
          </p>
          <a
            href="/products"
            className="inline-block bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg text-sm sm:text-base cursor-pointer"
            style={{ color: "#10b981" }}
          >
            {t("shopNow")}
          </a>
        </div>
      </section>
    </div>
  );
}