import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export default function ImageGallery({ images = [], alt = "Product" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // If single image, just show it
  if (!images || images.length === 0) return null;

  const next = () =>
    setActiveIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div>
        {/* Main image */}
        <div
          className="aspect-square rounded-2xl overflow-hidden border relative group cursor-zoom-in"
          style={{ borderColor: "var(--border)" }}
          onClick={() => setZoomed(true)}
        >
          <img
            src={images[activeIndex]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x600?text=No+Image";
            }}
          />

          {/* Zoom hint */}
          <div
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            <ZoomIn size={16} />
          </div>

          {/* Navigation arrows (only if multiple) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition cursor-pointer hover:scale-110"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition cursor-pointer hover:scale-110"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background:
                        i === activeIndex
                          ? "var(--accent)"
                          : "rgba(255,255,255,0.6)",
                      width: i === activeIndex ? "16px" : "8px",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer hover:scale-105"
                style={{
                  borderColor:
                    i === activeIndex ? "var(--accent)" : "var(--border)",
                }}
              >
                <img
                  src={img}
                  alt={`${alt} ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x200?text=?";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer hover:scale-110 transition"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={images[activeIndex]}
            alt={alt}
            className="max-w-full max-h-full object-contain animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}