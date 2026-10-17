import { useEffect } from "react";

/* ═══════════════════════════════════════════ */
/* 🎯 GLOBAL ERROR LOGGER                      */
/* ═══════════════════════════════════════════ */

const LOG_KEY = "shop-error-logs";
const MAX_LOGS = 50;

function saveLog(log) {
  try {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    logs.unshift(log);
    // Keep only last MAX_LOGS
    const trimmed = logs.slice(0, MAX_LOGS);
    localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Error log save failed", e);
  }
}

export function getErrorLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearErrorLogs() {
  localStorage.removeItem(LOG_KEY);
}

export default function ErrorLogger() {
  useEffect(() => {
    // Global JS errors
    const handleError = (event) => {
      saveLog({
        type: "error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || "",
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    // Unhandled promise rejections
    const handleRejection = (event) => {
      saveLog({
        type: "unhandledrejection",
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || "",
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}