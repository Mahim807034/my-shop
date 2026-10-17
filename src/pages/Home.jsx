import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../store/productStore";
import { useSiteContent } from "../store/siteContentStore";
import { useLanguage } from "../store/languageStore";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";
import ScrollReveal from "../components/ScrollReveal";

export default function Home() {
  const products = useProducts((s) => s.products);
  const content = useSiteContent((s) => s.content);
  const { t } = useLanguage();

  const { hero, features, featuredProducts, aboutSection, cta } = content;

  const featured = products.slice(0, featuredProducts?.count || 4);

  // ═══════════ HERO STYLE ═══════════
  const heroStyle = (() => {
    if (!hero) return {};

    if (hero.bgType === "image" && hero.bgImage) {
      const style = {
        backgroundImage: `url(${hero.bgImage})`,
        backgroundSize: hero.bgImageSize || "cover",
        backgroundPosition: hero.bgImagePosition || "center",
        backgroundRepeat: hero.bgImageRepeat || "no-repeat",
        position: "relative",
      };
      const blur = hero.bgImageBlur || 0;
      const brightness = hero.bgImageBrightness ?? 1;
      if (blur > 0 || brightness !== 1) {
        style.filter = `brightness(${brightness}) blur(${blur}px)`;
      }
      if (hero.customMinHeight > 0) {
        style.minHeight = `${hero.customMinHeight}px`;
      }
      return style;
    }

    if (hero.bgType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${
          hero.gradientFrom || "#10b981"
        } 0%, ${hero.gradientTo || "#3b82f6"} 100%)`,
      };
    }

    if (hero.bgType === "solid") {
      return { background: hero.solidColor || "#10b981" };
    }

    return {
      background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    };
  })();

  const heroOverlayStyle = (() => {
    if (!hero || hero.bgType !== "image" || !hero.bgImage) return null;

    if (hero.overlayGradient) {
      const dirMap = {
        "to-top": "0deg",
        "to-bottom": "180deg",
        "to-left": "270deg",
        "to-right": "90deg",
      };
      return {
        background: `linear-gradient(${
          dirMap[hero.overlayGradientDirection] || "0deg"
        }, ${hero.overlayGradientFrom || "#000000"}, ${
          hero.overlayGradientTo || "transparent"
        })`,
      };
    }

    const hex = hero.overlayColor || "#000000";
    const alpha = Math.round((hero.overlayOpacity ?? 0.5) * 255)
      .toString(16)
      .padStart(2, "0");
    return { background: `${hex}${alpha}` };
  })();

  const heroHeightClass =
    hero?.customMinHeight > 0
      ? "py-16 sm:py-20"
      : {
          small: "py-12 sm:py-16 md:py-20",
          medium: "py-14 sm:py-20 md:py-28 lg:py-32",
          large: "py-20 sm:py-28 md:py-36 lg:py-40",
        }[hero?.height || "medium"];

  const isBgImageMode = hero?.bgType === "image" && hero?.bgImage;

  const heroAlignmentClass = {
    center: "text-center mx-auto",
    left: "text-left",
    right: "text-right ml-auto",
  }[hero?.alignment || "center"];

  // ═══════════ ABOUT STYLE ═══════════
  const aboutStyle = (() => {
    if (!aboutSection) return {};

    if (aboutSection.bgType === "image" && aboutSection.bgImage) {
      const style = {
        backgroundImage: `url(${aboutSection.bgImage})`,
        backgroundSize: aboutSection.bgImageSize || "cover",
        backgroundPosition: aboutSection.bgImagePosition || "center",
        backgroundRepeat: aboutSection.bgImageRepeat || "no-repeat",
        position: "relative",
      };
      const blur = aboutSection.bgImageBlur || 0;
      const brightness = aboutSection.bgImageBrightness ?? 1;
      if (blur > 0 || brightness !== 1) {
        style.filter = `brightness(${brightness}) blur(${blur}px)`;
      }
      if (aboutSection.customMinHeight > 0) {
        style.minHeight = `${aboutSection.customMinHeight}px`;
      }
      return style;
    }

    if (aboutSection.bgType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${
          aboutSection.gradientFrom || "#10b981"
        } 0%, ${aboutSection.gradientTo || "#3b82f6"} 100%)`,
      };
    }

    if (aboutSection.bgType === "solid") {
      return {
        background: aboutSection.solidColor || "var(--bg-secondary)",
      };
    }

    return { background: "var(--bg-secondary)" };
  })();

  const aboutOverlayStyle = (() => {
    if (
      !aboutSection ||
      aboutSection.bgType !== "image" ||
      !aboutSection.bgImage
    )
      return null;

    if (aboutSection.overlayGradient) {
      const dirMap = {
        "to-top": "0deg",
        "to-bottom": "180deg",
        "to-left": "270deg",
        "to-right": "90deg",
      };
      return {
        background: `linear-gradient(${
          dirMap[aboutSection.overlayGradientDirection] || "0deg"
        }, ${aboutSection.overlayGradientFrom || "#000000"}, ${
          aboutSection.overlayGradientTo || "transparent"
        })`,
      };
    }

    const hex = aboutSection.overlayColor || "#000000";
    const alpha = Math.round((aboutSection.overlayOpacity ?? 0.5) * 255)
      .toString(16)
      .padStart(2, "0");
    return { background: `${hex}${alpha}` };
  })();

  const isAboutBgImage =
    aboutSection?.bgType === "image" && aboutSection?.bgImage;

  const aboutTextColor = aboutSection?.textColorCustom || "#ffffff";

  return (
    <div>
      {/* ═══════════ HERO SECTION ═══════════ */}
      {hero?.enabled && (
        <section
          className={`relative overflow-hidden ${heroHeightClass} px-4 animate-fadeIn flex items-center`}
          style={heroStyle}
        >
          {heroOverlayStyle && (
            <div
              className="absolute inset-0 z-[1]"
              style={heroOverlayStyle}
              aria-hidden="true"
            />
          )}

          {!isBgImageMode && (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-10 left-10 w-40 sm:w-72 h-40 sm:h-72 rounded-full bg-white blur-3xl animate-pulse-slow"></div>
              <div
                className="absolute bottom-10 right-10 w-52 sm:w-96 h-52 sm:h-96 rounded-full bg-white blur-3xl animate-pulse-slow"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          )}

          <div className="max-w-6xl mx-auto relative z-10 w-full">
            {isBgImageMode ? (
              <div className={`${heroAlignmentClass} max-w-3xl`}>
                <h1
                  className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6 animate-fadeIn leading-tight drop-shadow-lg"
                  style={{ color: hero.textColor || "#ffffff" }}
                >
                  {hero.title || t("welcome")}
                </h1>
                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fadeIn drop-shadow-md"
                  style={{
                    color: hero.textColor || "#ffffff",
                    opacity: 0.95,
                    animationDelay: "0.2s",
                  }}
                >
                  {hero.subtitle || t("welcomeSubtitle")}
                </p>

                <div
                  className={`flex flex-wrap gap-3 animate-fadeIn ${
                    hero?.alignment === "center" ? "justify-center" : ""
                  }`}
                  style={{ animationDelay: "0.3s" }}
                >
                  {hero.buttonPrimary?.text && (
                    <Link
                      to={hero.buttonPrimary.to || "/products"}
                      className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl text-sm sm:text-base cursor-pointer"
                      style={{
                        background: hero.buttonPrimary.bgColor || "#ffffff",
                        color: hero.buttonPrimary.textColor || "#10b981",
                      }}
                    >
                      {hero.buttonPrimary.text || t("shopNow")}
                      <ArrowRight size={16} className="sm:hidden" />
                      <ArrowRight size={18} className="hidden sm:block" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-8 items-center ${
                  hero.image ? "md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                <div
                  className={`${heroAlignmentClass} ${
                    hero.image && hero.imagePosition === "left"
                      ? "md:order-2"
                      : "md:order-1"
                  } ${!hero.image ? "max-w-3xl" : ""}`}
                >
                  <h1
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-6 animate-fadeIn leading-tight"
                    style={{ color: hero.textColor || "#ffffff" }}
                  >
                    {hero.title || t("welcome")}
                  </h1>
                  <p
                    className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fadeIn"
                    style={{
                      color: hero.textColor || "#ffffff",
                      opacity: 0.9,
                      animationDelay: "0.2s",
                    }}
                  >
                    {hero.subtitle || t("welcomeSubtitle")}
                  </p>

                  <div
                    className={`flex flex-wrap gap-3 animate-fadeIn ${
                      hero.alignment === "center" && !hero.image
                        ? "justify-center"
                        : ""
                    }`}
                    style={{ animationDelay: "0.3s" }}
                  >
                    {hero.buttonPrimary?.text && (
                      <Link
                        to={hero.buttonPrimary.to || "/products"}
                        className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl text-sm sm:text-base cursor-pointer"
                        style={{
                          background:
                            hero.buttonPrimary.bgColor || "#ffffff",
                          color: hero.buttonPrimary.textColor || "#10b981",
                        }}
                      >
                        {hero.buttonPrimary.text || t("shopNow")}
                        <ArrowRight size={16} className="sm:hidden" />
                        <ArrowRight size={18} className="hidden sm:block" />
                      </Link>
                    )}
                  </div>
                </div>

                {hero.image && (
                  <div
                    className={`animate-fadeIn flex justify-center ${
                      hero.imagePosition === "left"
                        ? "md:order-1"
                        : "md:order-2"
                    }`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    <img
                      src={hero.image}
                      alt="Hero"
                      className="w-full max-w-md md:max-w-full rounded-2xl shadow-2xl object-cover"
                      style={{ maxHeight: "500px" }}
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ PRODUCT SLIDER ═══════════ */}
      {products.length > 0 && (
        <ScrollReveal animation="fadeIn" duration={500}>
          <section className="py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("featuredHighlights")}
                  </h2>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("featuredSubtitle")}
                  </p>
                </div>
              </div>
            </div>

            <HeroSlider products={products} autoPlayInterval={2000} />
          </section>
        </ScrollReveal>
      )}

      {/* ═══════════ FEATURES ═══════════ */}
      {features?.enabled && features.items?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8 sm:py-14 md:py-16">
          {features.title && (
            <ScrollReveal animation="slideUp">
              <div className="text-center mb-8 sm:mb-12">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {features.title || t("whyChooseUs")}
                </h2>
              </div>
            </ScrollReveal>
          )}

          <div
            className={`grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 ${
              features.items.length === 2
                ? "sm:grid-cols-2"
                : features.items.length >= 3
                ? "sm:grid-cols-2 md:grid-cols-3"
                : "sm:grid-cols-1"
            }`}
          >
            {features.items.map((f, i) => (
              <ScrollReveal
                key={i}
                animation="slideUp"
                delay={i * 100}
                duration={600}
              >
                <div
                  className="p-4 sm:p-5 md:p-6 rounded-xl border text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                    {f.icon}
                  </div>
                  <h3
                    className="font-bold mb-1 text-sm sm:text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      {featuredProducts?.enabled && (
        <section className="max-w-6xl mx-auto px-4 pb-10 sm:pb-16">
          <ScrollReveal animation="slideUp">
            <div className="flex items-center justify-between mb-4 sm:mb-8 gap-3">
              <h2
                className="text-lg sm:text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {featuredProducts.title || t("featuredProducts")}
              </h2>
              {featuredProducts.viewAllText && (
                <Link
                  to={featuredProducts.viewAllLink || "/products"}
                  className="text-xs sm:text-sm font-medium hover:underline flex items-center gap-1 transition-all hover:gap-2 whitespace-nowrap cursor-pointer"
                  style={{ color: "var(--accent)" }}
                >
                  {featuredProducts.viewAllText || t("viewAll")}
                  <ArrowRight size={12} className="sm:hidden" />
                  <ArrowRight size={14} className="hidden sm:block" />
                </Link>
              )}
            </div>
          </ScrollReveal>

          {featured.length === 0 ? (
            <div
              className="text-center py-12 rounded-xl border"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("noProducts")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ═══════════ ABOUT ═══════════ */}
      {aboutSection?.enabled && (
        <section
          className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4 my-4"
          style={aboutStyle}
        >
          {aboutOverlayStyle && (
            <div
              className="absolute inset-0 z-[1]"
              style={aboutOverlayStyle}
              aria-hidden="true"
            />
          )}

          <div className="max-w-6xl mx-auto relative z-10">
            <div
              className={`grid gap-8 items-center ${
                !isAboutBgImage && aboutSection.image
                  ? "md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {!isAboutBgImage && aboutSection.image && (
                <ScrollReveal animation="slideRight">
                  <div className="order-2 md:order-1">
                    <img
                      src={aboutSection.image}
                      alt="About"
                      className="w-full rounded-xl"
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal animation="slideLeft">
                <div
                  className={
                    !isAboutBgImage && aboutSection.image
                      ? "order-1 md:order-2"
                      : isAboutBgImage
                      ? "text-center max-w-3xl mx-auto"
                      : ""
                  }
                >
                  <h2
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
                      isAboutBgImage ? "drop-shadow-lg" : ""
                    }`}
                    style={{
                      color: isAboutBgImage
                        ? aboutTextColor
                        : "var(--text-primary)",
                    }}
                  >
                    {aboutSection.title || t("aboutUs")}
                  </h2>
                  <p
                    className={`text-sm sm:text-base leading-relaxed mb-6 ${
                      isAboutBgImage ? "drop-shadow-md" : ""
                    }`}
                    style={{
                      color: isAboutBgImage
                        ? aboutTextColor
                        : "var(--text-secondary)",
                      opacity: isAboutBgImage ? 0.95 : 1,
                    }}
                  >
                    {aboutSection.description}
                  </p>

                  {aboutSection.stats?.length > 0 && (
                    <div
                      className={`grid gap-4 ${
                        isAboutBgImage
                          ? "grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto"
                          : aboutSection.stats.length === 4
                          ? "grid-cols-2 sm:grid-cols-4"
                          : aboutSection.stats.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2"
                      }`}
                    >
                      {aboutSection.stats.map((stat, i) => (
                        <ScrollReveal
                          key={i}
                          animation="scaleIn"
                          delay={i * 100}
                        >
                          <div className="text-center">
                            <p
                              className={`text-2xl sm:text-3xl font-bold ${
                                isAboutBgImage ? "drop-shadow-lg" : ""
                              }`}
                              style={{
                                color: isAboutBgImage
                                  ? aboutTextColor
                                  : "var(--accent)",
                              }}
                            >
                              {stat.value}
                            </p>
                            <p
                              className={`text-xs ${
                                isAboutBgImage ? "drop-shadow-md" : ""
                              }`}
                              style={{
                                color: isAboutBgImage
                                  ? aboutTextColor
                                  : "var(--text-secondary)",
                                opacity: isAboutBgImage ? 0.9 : 1,
                              }}
                            >
                              {stat.label}
                            </p>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA ═══════════ */}
      {cta?.enabled && (
        <ScrollReveal animation="slideUp">
          <section className="max-w-4xl mx-auto px-4 pb-12 sm:pb-20">
            <div
              className="rounded-2xl p-6 sm:p-10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white">
                {cta.title || t("readyToShop")}
              </h2>
              {cta.subtitle && (
                <p className="text-white/90 mb-6 max-w-xl mx-auto text-sm sm:text-base">
                  {cta.subtitle || t("browseCollection")}
                </p>
              )}
              {cta.buttonText && (
                <Link
                  to={cta.buttonLink || "/products"}
                  className="inline-block bg-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg text-sm sm:text-base cursor-pointer"
                  style={{ color: "#10b981" }}
                >
                  {cta.buttonText || t("shopNow")}
                </Link>
              )}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}