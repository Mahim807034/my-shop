import { useEffect, useRef, useState } from "react";

/* 🎯 Scroll reveal wrapper
   Usage:
   <ScrollReveal>
     <div>Your content</div>
   </ScrollReveal>
   
   <ScrollReveal animation="slideUp" delay={200}>
     <div>Your content</div>
   </ScrollReveal>
*/

const ANIMATIONS = {
  fadeIn: {
    from: "opacity: 0;",
    to: "opacity: 1;",
  },
  slideUp: {
    from: "opacity: 0; transform: translateY(40px);",
    to: "opacity: 1; transform: translateY(0);",
  },
  slideDown: {
    from: "opacity: 0; transform: translateY(-40px);",
    to: "opacity: 1; transform: translateY(0);",
  },
  slideLeft: {
    from: "opacity: 0; transform: translateX(40px);",
    to: "opacity: 1; transform: translateX(0);",
  },
  slideRight: {
    from: "opacity: 0; transform: translateX(-40px);",
    to: "opacity: 1; transform: translateX(0);",
  },
  scaleIn: {
    from: "opacity: 0; transform: scale(0.9);",
    to: "opacity: 1; transform: scale(1);",
  },
  fadeZoom: {
    from: "opacity: 0; transform: scale(0.95);",
    to: "opacity: 1; transform: scale(1);",
  },
  flipIn: {
    from: "opacity: 0; transform: perspective(600px) rotateX(-20deg);",
    to: "opacity: 1; transform: perspective(600px) rotateX(0);",
  },
};

export default function ScrollReveal({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = true,
  className = "",
  style = {},
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, once]);

  const anim = ANIMATIONS[animation] || ANIMATIONS.slideUp;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0) translateX(0) scale(1) perspective(600px) rotateX(0)"
          : extractTransform(anim.from),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// Extract transform value from animation string
function extractTransform(str) {
  const match = str.match(/transform:\s*([^;]+);/);
  return match ? match[1].trim() : "translateY(40px)";
}

/* 🎯 Alternative: Hook for custom use */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    once = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, once]);

  return { ref, isVisible };
}