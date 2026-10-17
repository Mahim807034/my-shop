import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useReviews } from "../store/reviewStore";
import { useWishlist } from "../store/wishlistStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function HeroSlider({
  products = [],
  autoPlayInterval = 2000,
}) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timeoutRef = useRef(null);

  const addItem = useCart((s) => s.addItem);
  const settings = useSettings((s) => s.settings);
  const allReviews = useReviews((s) => s.reviews);
  const { toggleItem, isInWishlist } = useWishlist();
  const { t } = useLanguage();

  const currency = settings.currency || "৳";

  const sliderProducts = products.filter((p) => p?.image).slice(0, 8);

  useEffect(() => {
    if (sliderProducts.length <= 1) return;

    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderProducts.length);
    }, autoPlayInterval);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [sliderProducts.length, autoPlayInterval]);

  useEffect(() => {
    if (current >= sliderProducts.length) {
      setCurrent(0);
    }
  }, [sliderProducts.length, current]);

  if (sliderProducts.length === 0) return null;

  const next = () => {
    setCurrent((prev) => (prev + 1) % sliderProducts.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + sliderProducts.length) % sliderProducts.length
    );
  };

  const goTo = (index) => setCurrent(index);

  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(
      e.target.touches
        ? e.target.touches[0].clientX
        : e.targetTouches[0].clientX
    );
  };

  const handleTouchMove = (e) => {
    setTouchEnd(
      e.target.touches
        ? e.target.touches[0].clientX
        : e.targetTouches[0].clientX
    );
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) next();
    if (distance < -50) prev();
  };

  return (
    <section
      className="relative overflow-hidden w-full animate-fadeIn"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full"
        style={{
          background: "var(--bg-secondary)",
          minHeight: "500px",
        }}
      >
        <div className="relative">
          {sliderProducts.map((p, i) => {
            const isActive = i === current;
            const pReviews = allReviews[p.id] || [];
            const pAvg =
              pReviews.length > 0
                ? pReviews.reduce((sum, r) => sum + r.rating, 0) /
                  pReviews.length
                : 0;
            const inWishlist = isInWishlist(p.id);

            const handleAddToCart = (e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(p);
              toast.success(`${p.name} ✓`);
            };

            const handleWishlist = (e) => {
              e.preventDefault();
              e.stopPropagation();
              const added = toggleItem(p);
              toast.success(added ? `✓ ${t("wishlist")}` : `× ${t("wishlist")}`);
            };

            return (
              <div
                key={p.id}
                className={`transition-all duration-500 ${
                  isActive
                    ? "opacity-100 pointer-events-auto relative z-10"
                    : "opacity-0 pointer-events-none absolute inset-0 z-0"
                }`}
              >
                <Link to={`/product/${p.id}`} className="block cursor-pointer">
                  <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                      {/* Left — Text */}
                      <div
                        className={`order-2 md:order-1 text-center md:text-left ${
                          isActive ? "animate-slideInRight" : ""
                        }`}
                      >
                        <div className="inline-block mb-3">
                          <span
                            className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full text-white uppercase tracking-wider shadow-md"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                            }}
                          >
                            {p.category}
                          </span>
                        </div>

                        <h2
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {p.name}
                        </h2>

                        {pReviews.length > 0 && (
                          <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={16}
                                  fill={
                                    s <= Math.round(pAvg)
                                      ? "#f59e0b"
                                      : "none"
                                  }
                                  style={{
                                    color:
                                      s <= Math.round(pAvg)
                                        ? "#f59e0b"
                                        : "var(--border)",
                                  }}
                                />
                              ))}
                            </div>
                            <span
                              className="text-sm font-semibold"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {pAvg.toFixed(1)} ({pReviews.length})
                            </span>
                          </div>
                        )}

                        <p
                          className="text-sm sm:text-base mb-5 line-clamp-2 max-w-md mx-auto md:mx-0"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {p.description}
                        </p>

                        <div className="flex items-end gap-3 justify-center md:justify-start mb-6">
                          <p
                            className="text-3xl sm:text-4xl md:text-5xl font-bold"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {currency}
                            {p.price}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <button
                            onClick={handleAddToCart}
                            className="px-5 sm:px-7 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                            }}
                          >
                            <ShoppingCart size={18} />
                            {t("addToCart")}
                          </button>

                          <span
                            className="px-5 sm:px-7 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer text-sm sm:text-base border-2"
                            style={{
                              color: "var(--accent)",
                              borderColor: "var(--accent)",
                              background: "transparent",
                            }}
                          >
                            {t("viewDetails")}
                          </span>
                        </div>
                      </div>

                      {/* Right — Image */}
                      <div className="order-1 md:order-2 relative flex justify-center">
                        <div
                          className={`relative w-full max-w-sm md:max-w-full aspect-square rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02] ${
                            isActive ? "animate-fadeZoom" : ""
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/600x600?text=No+Image";
                            }}
                          />

                          <div
                            className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                            }}
                          />

                          <button
                            onClick={handleWishlist}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                            style={{
                              background: inWishlist
                                ? "#ef4444"
                                : "var(--bg-secondary)",
                              color: inWishlist
                                ? "white"
                                : "var(--text-primary)",
                            }}
                            aria-label={t("wishlist")}
                          >
                            <Heart
                              size={18}
                              fill={inWishlist ? "white" : "none"}
                            />
                          </button>

                          <div
                            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                            }}
                          >
                            🔥 {t("hotDeal")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {sliderProducts.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-20"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-20"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        {sliderProducts.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {sliderProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all cursor-pointer"
                style={{
                  width: i === current ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    i === current
                      ? "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)"
                      : "var(--border)",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}