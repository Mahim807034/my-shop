import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight, Store } from "lucide-react";
import { useAdmin } from "../../store/adminStore";
import { useLanguage } from "../../store/languageStore";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAdmin();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const res = login(form.username, form.password);
      if (res.success) {
        toast.success(`✓ ${t("adminLogin")}`);
        navigate("/admin");
      } else {
        toast.error(res.error);
      }
      setLoading(false);
    }, 500);
  };

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-scaleIn"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            <Store size={32} className="text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            {t("adminLogin")}
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("adminLoginSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              {t("username")}
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                style={inputStyle}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm sm:text-base cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {loading ? (
              t("loading")
            ) : (
              <>
                {t("loginNow")} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          className="mt-6 p-3 rounded-lg text-xs"
          style={{ background: "var(--bg-primary)" }}
        >
          <p style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text-primary)" }}>
              {t("demoCredentials")}:
            </strong>{" "}
            admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}