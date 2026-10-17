import { useState } from "react";

export default function SmartImage({
  src,
  alt = "",
  className = "",
  style = {},
  fallbackSrc = "https://via.placeholder.com/400x400?text=No+Image",
  aspectRatio = "square",
  priority = false,
  onLoad = null,
  onError = null,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setError(true);
    e.target.src = fallbackSrc;
    if (onError) onError(e);
  };

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[16/10]",
    auto: "",
  };

  return (
    <div
      className={`relative overflow-hidden ${
        aspectClasses[aspectRatio] || ""
      } ${className}`}
      style={style}
    >
      {/* Blur placeholder */}
      {!loaded && !error && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)",
            backgroundSize: "1000px 100%",
            animation: "shimmer 1.5s infinite linear",
          }}
        />
      )}

      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        {...props}
      />
    </div>
  );
}