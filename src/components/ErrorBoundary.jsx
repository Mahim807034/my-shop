import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-4 py-12"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="w-full max-w-md text-center">
            {/* Icon */}
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-bounceIn shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
              }}
            >
              <AlertTriangle size={40} className="text-white" />
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Oops! Something went wrong
            </h1>
            <p
              className="mb-6 text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              We're sorry for the inconvenience. Please try again.
            </p>

            {/* Error message (dev only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div
                className="mb-6 p-4 rounded-xl text-left text-xs overflow-auto max-h-40 border"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                  color: "#ef4444",
                }}
              >
                <p className="font-bold mb-2">Error Details (dev only):</p>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <RefreshCw size={16} /> Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border-2 flex items-center justify-center gap-2 cursor-pointer text-sm"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <Home size={16} /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}