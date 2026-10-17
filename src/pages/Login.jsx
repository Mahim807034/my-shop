import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  Shield,
  Users,
  AlertCircle,
  AtSign,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { useAdmin } from "../store/adminStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user, isAdmin: userIsAdmin } = useAuth();
  const { setAdmin, isAdmin: adminIsAdmin } = useAdmin();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (adminIsAdmin) {
      navigate("/admin", { replace: true });
      return;
    }
    if (user) {
      if (userIsAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [adminIsAdmin, user, userIsAdmin, navigate]);

  const looksLikeAdmin =
    form.identifier &&
    (form.identifier.toLowerCase().includes("admin") ||
      form.identifier.toLowerCase().endsWith("_admin"));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(form.identifier, form.password);

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        setLoading(false);
        return;
      }

      if (result.isAdmin) {
        setAdmin(result.user?.email, result.user?.name);
        toast.success(`✓ ${t("adminLogin")}`);

        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 100);
      } else {
        toast.success(`✓ ${t("login")}`);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      }

      setLoading(false);
    }, 700);
  };

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 animate-scaleIn"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {t("welcomeBack")}
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("loginSubtitle")}
          </p>
        </div>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg border flex items-start gap-2 text-xs animate-fadeIn"
            style={{ background: "#ef444415", borderColor: "#ef4444" }}
          >
            <AlertCircle
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: "#ef4444" }}
            />
            <p style={{ color: "#ef4444" }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5 sm:mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("emailOrAdminId")}
            </label>
            <div className="relative">
              <AtSign
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                value={form.identifier}
                onChange={(e) => {
                  setForm({ ...form, identifier: e.target.value });
                  setError("");
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
              />
            </div>

            {form.identifier && (
              <div
                className="mt-2 flex items-center gap-1.5 text-xs animate-fadeIn"
                style={{
                  color: looksLikeAdmin
                    ? "#8b5cf6"
                    : "var(--text-secondary)",
                }}
              >
                {looksLikeAdmin ? (
                  <>
                    <Shield size={12} />
                    <span>{t("adminLogin")}</span>
                  </>
                ) : (
                  <>
                    <Users size={12} />
                    <span>{t("clientLogin")}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {t("password")}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium hover:underline cursor-pointer"
                style={{ color: "var(--accent)" }}
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm sm:text-base cursor-pointer"
            style={{
              background: looksLikeAdmin
                ? "#8b5cf6"
                : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {loading ? (
              t("loading")
            ) : looksLikeAdmin ? (
              <>
                <Shield size={16} /> {t("adminLogin")}
              </>
            ) : (
              <>
                {t("loginNow")} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p
          className="text-center mt-5 sm:mt-6 text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("noAccount")}{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            {t("signup")}
          </Link>
        </p>

        <div
          className="mt-5 p-3 rounded-lg text-[10px] sm:text-xs"
          style={{ background: "var(--bg-primary)" }}
        >
          <p
            className="font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            💡 {t("loginTips")}
          </p>
          <ul
            className="space-y-0.5 list-disc list-inside"
            style={{ color: "var(--text-secondary)" }}
          >
            <li>
              {t("adminLogin")} — email বা ID
            </li>
            <li>
              {t("clientLogin")} — শুধু email
            </li>
            <li>
              {t("forgotPassword")} — reset link
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}