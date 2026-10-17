import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  AlertCircle,
  Check,
  Users,
  Copy,
  IdCard,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { useAdmin } from "../store/adminStore";
import { useLanguage } from "../store/languageStore";
import {
  generateAdminId,
  isValidEmailFormat,
} from "../utils/emailHelper";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { signup, hasAdmin } = useAuth();
  const { setAdmin } = useAdmin();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const adminExists = hasAdmin();
  const emailValid = isValidEmailFormat(form.email);
  const adminId = useMemo(
    () => (form.email && emailValid ? generateAdminId(form.email) : ""),
    [form.email, emailValid]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!emailValid) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const signupRole = adminExists ? "client" : role;

      const result = signup(
        form.name,
        form.email,
        form.password,
        signupRole
      );

      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      if (result.isAdmin) {
        setAdmin(form.email, form.name);
        toast.success(`Admin: ${result.adminId}`);
        navigate("/admin");
      } else {
        toast.success("Account created!");
        navigate("/");
      }

      setLoading(false);
    }, 700);
  };

  const handleCopyId = () => {
    if (!adminId) return;
    navigator.clipboard.writeText(adminId);
    setCopied(true);
    toast.success("ID copied!");
    setTimeout(() => setCopied(false), 2000);
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
        <div className="text-center mb-5 sm:mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {t("createAccount")}
          </h1>
        </div>

        {/* Role Selector */}
        {!adminExists && (
          <div className="mb-5 animate-fadeIn">
            <label
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Sign up as
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  role === "client"
                    ? "scale-[1.02] shadow-lg"
                    : "hover:scale-[1.01]"
                }`}
                style={{
                  borderColor:
                    role === "client"
                      ? "var(--accent)"
                      : "var(--border)",
                  background:
                    role === "client" ? "var(--bg-primary)" : "transparent",
                }}
              >
                {role === "client" && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "var(--accent)" }}
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "var(--accent)" }}
                >
                  <Users size={20} className="text-white" />
                </div>
                <p
                  className="font-bold text-xs sm:text-sm mb-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("clientLogin")}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  role === "admin"
                    ? "scale-[1.02] shadow-lg"
                    : "hover:scale-[1.01]"
                }`}
                style={{
                  borderColor:
                    role === "admin" ? "#8b5cf6" : "var(--border)",
                  background:
                    role === "admin" ? "var(--bg-primary)" : "transparent",
                }}
              >
                {role === "admin" && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#8b5cf6" }}
                  >
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "#8b5cf6" }}
                >
                  <Shield size={20} className="text-white" />
                </div>
                <p
                  className="font-bold text-xs sm:text-sm mb-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("adminLogin")}
                </p>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("fullName")}
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("fullNamePlaceholder")}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("email")}
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
              />
            </div>

            {form.email && (
              <div
                className="mt-2 flex items-center gap-1.5 text-xs animate-fadeIn"
                style={{
                  color: emailValid ? "#10b981" : "#ef4444",
                }}
              >
                {emailValid ? (
                  <>
                    <Check size={12} />
                    <span>Valid email ✓</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} />
                    <span>Invalid email</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Admin ID preview */}
          {role === "admin" && !adminExists && adminId && (
            <div
              className="p-3 sm:p-4 rounded-xl border-2 animate-fadeIn"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf615 0%, #8b5cf605 100%)",
                borderColor: "#8b5cf6",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <IdCard size={14} style={{ color: "#8b5cf6" }} />
                <p
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#8b5cf6" }}
                >
                  Your Admin ID
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3 py-2 rounded-lg font-mono text-sm sm:text-base font-bold truncate"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {adminId}
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-2 rounded-lg transition hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
                  style={{ background: "#8b5cf6" }}
                >
                  {copied ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Copy size={16} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("password")}
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("confirmPassword")}
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="password"
                value={form.confirm}
                onChange={(e) =>
                  setForm({ ...form, confirm: e.target.value })
                }
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
              background:
                role === "admin" && !adminExists
                  ? "#8b5cf6"
                  : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {loading ? (
              t("loading")
            ) : role === "admin" && !adminExists ? (
              <>
                <Shield size={16} /> {t("createAccount")}
              </>
            ) : (
              <>
                {t("signupNow")} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p
          className="text-center mt-5 sm:mt-6 text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("hasAccount")}{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            {t("loginNow")}
          </Link>
        </p>
      </div>
    </div>
  );
}