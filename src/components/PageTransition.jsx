import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════ */
/* 🎯 PAGE TRANSITION — Route change animation */
/* ═══════════════════════════════════════════ */

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState("fadeIn");
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== previousPath.current) {
      setStage("fadeOut");

      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setStage("fadeIn");
        previousPath.current = location.pathname;

        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 200);

      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children]);

  return (
    <div
      key={location.pathname}
      style={{
        animation:
          stage === "fadeIn"
            ? "pageSlideIn 0.5s ease-out forwards"
            : "pageSlideOut 0.2s ease-in forwards",
      }}
    >
      <style>{`
        @keyframes pageSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pageSlideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pageSlideIn {
            from, to { opacity: 1; transform: none; }
          }
          @keyframes pageSlideOut {
            from, to { opacity: 1; transform: none; }
          }
        }
      `}</style>
      {displayChildren}
    </div>
  );
}