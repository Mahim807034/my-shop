import { useState, useEffect } from "react";

/* 🎯 Reading Progress Bar — top of page indicator */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
        boxShadow: progress > 0 ? "0 0 10px rgba(16, 185, 129, 0.5)" : "none",
      }}
      aria-hidden="true"
    />
  );
}