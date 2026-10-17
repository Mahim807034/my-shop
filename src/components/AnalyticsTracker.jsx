import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "../utils/analytics";

/* 🎯 Automatically tracks page views on route change */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Small delay to allow page to render
    const timer = setTimeout(() => {
      track.pageView(location.pathname + location.search);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}