import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import ScrollToTop from "./ScrollToTop";
import ReadingProgress from "./ReadingProgress";
import PageTransition from "./PageTransition";
import CookieConsent from "./CookieConsent";
import AnalyticsTracker from "./AnalyticsTracker";
import ErrorLogger from "./ErrorLogger";
import WhatsAppFloat from "./WhatsAppFloat";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Trackers (invisible) */}
      <AnalyticsTracker />
      <ErrorLogger />

      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <ReadingProgress />
      <AnnouncementBar />
      <Navbar />

      <main id="main-content" className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
      <ScrollToTop />
      <WhatsAppFloat />
      <CookieConsent />
    </div>
  );
}