import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Shield,
  AlertCircle,
  Check,
  KeyRound,
  Copy,
  RefreshCw,
  Send,
  MailCheck,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { useAdmin } from "../store/adminStore";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: verify, 2: OTP, 3: new password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(""); // user input
  const [generatedOtp, setGeneratedOtp] = useState(""); // the correct code
  const [otpInput, setOtpInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(0);

  const {
    verifyAdminIdentity,
    resetAdminPassword,
    login,
    user,
    isAdmin: userIsAdmin,
  } = useAuth();
  const { setAdmin, isAdmin: adminIsAdmin } = useAdmin();
  const navigate = useNavigate();

  // Auto redirect if already logged in
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

  // Countdown timer for OTP
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  // Generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Step 1: Verify email/ID → generate OTP
  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = verifyAdminIdentity(identifier);

      if (!res.success) {
        setError(res.error);
        toast.error(res.error);
        setLoading(false);
        return;
      }

      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      setTimer(60); // 60 seconds expiry
      toast.success("Verification code sent!");
      setStep(2);
      setLoading(false);
    }, 600);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (timer === 0) {
      setError("Code expired. Please request a new one.");
      toast.error("Code expired!");
      return;
    }

    if (otpInput.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (otpInput !== generatedOtp) {
        setError("Incorrect code. Please try again.");
        toast.error("Incorrect code");
        setLoading(false);
        return;
      }

      toast.success("Code verified!");
      setStep(3);
      setLoading(false);
    }, 500);
  };

  // Step 3: Reset password
  const handleReset = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = resetAdminPassword(identifier, password);

      if (!res.success) {
        setError(res.error);
        toast.error(res.error);
        setLoading(false);
        return;
      }

      toast.success("Password reset successfully!");

      // Auto login
      const loginRes = login(identifier, password);

      if (loginRes.success && loginRes.isAdmin) {
        setAdmin(loginRes.user?.email, loginRes.user?.name);
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 150);
      } else {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 150);
      }

      setLoading(false);
    }, 700);
  };

  // Resend OTP
  const handleResendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtpInput("");
    setError("");
    setTimer(60);
    toast.success("New code sent!");
  };

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) {
      setStep(1);
      setOtpInput("");
      setGeneratedOtp("");
      setTimer(0);
    } else navigate("/login");
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
        {/* Back */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 transition hover:-translate-x-1 text-xs sm:text-sm cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={14} />
          {step === 1 ? "Back to Login" : "Back"}
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: "var(--accent)" }}
          >
            {step === 1 && <KeyRound size={26} className="text-white" />}
            {step === 2 && <MailCheck size={26} className="text-white" />}
            {step === 3 && <Lock size={26} className="text-white" />}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            {step === 1 && "Reset Password"}
            {step === 2 && "Verify Code"}
            {step === 3 && "New Password"}
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {step === 1 && "Verify your admin identity"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {/* Step Indicator (3 steps) */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background:
                    step >= s ? "var(--accent)" : "var(--bg-primary)",
                  color: step >= s ? "white" : "var(--text-secondary)",
                }}
              >
                {step > s ? <Check size={13} /> : s}
              </div>
              {i < 2 && (
                <div
                  className="w-8 sm:w-12 h-1 rounded-full transition-all"
                  style={{
                    background:
                      step > s ? "var(--accent)" : "var(--bg-primary)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
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

        {/* ═══════════════ STEP 1: Verify ═══════════════ */}
        {step === 1 && (
          <form onSubmit={handleVerify} className="space-y-4 animate-fadeIn">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                Admin Email or Admin ID
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError("");
                  }}
                  placeholder="mahim807034@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                  style={inputStyle}
                  required
                  autoFocus
                />
              </div>
              <p
                className="text-[10px] sm:text-xs mt-2 flex items-center gap-1"
                style={{ color: "var(--text-secondary)" }}
              >
                <Shield size={11} />
                A 6-digit verification code will be sent
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm sm:text-base cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                "Sending code..."
              ) : (
                <>
                  <Send size={16} /> Send Verification Code
                </>
              )}
            </button>
          </form>
        )}

        {/* ═══════════════ STEP 2: OTP ═══════════════ */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
            {/* Demo OTP display */}
            <div
              className="p-4 rounded-xl border-2 border-dashed"
              style={{
                background: "#f59e0b10",
                borderColor: "#f59e0b",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MailCheck size={14} style={{ color: "#f59e0b" }} />
                <p
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#f59e0b" }}
                >
                  📧 Email Verification Code (Demo)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3 py-2.5 rounded-lg font-mono text-xl sm:text-2xl font-bold text-center tracking-[0.3em]"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {generatedOtp}
                </div>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="p-3 rounded-lg transition hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
                  style={{ background: "#f59e0b" }}
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check size={18} className="text-white" />
                  ) : (
                    <Copy size={18} className="text-white" />
                  )}
                </button>
              </div>

              <p
                className="text-[10px] sm:text-xs mt-2 leading-snug italic"
                style={{ color: "var(--text-secondary)" }}
              >
                💡 Demo তে code এখানে দেখা যাচ্ছে। Real app এ এটা আপনার
                email এ পাঠানো হবে।
              </p>
            </div>

            {/* OTP input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Enter 6-digit Code
                </label>
                {timer > 0 ? (
                  <span
                    className="text-xs font-mono font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    ⏱ {timer}s
                  </span>
                ) : (
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#ef4444" }}
                  >
                    Expired
                  </span>
                )}
              </div>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpInput(val);
                  setError("");
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-center text-2xl font-mono font-bold tracking-[0.5em]"
                style={inputStyle}
                required
                autoFocus
              />
            </div>

            {/* Resend */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-xs font-medium hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                style={{ color: "var(--accent)" }}
              >
                <RefreshCw size={12} /> Resend Code
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || timer === 0}
              className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 text-sm sm:text-base cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  <Check size={16} /> Verify Code
                </>
              )}
            </button>
          </form>
        )}

        {/* ═══════════════ STEP 3: New Password ═══════════════ */}
        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-4 animate-fadeIn">
            <div
              className="p-3 rounded-lg flex items-start gap-2 text-xs"
              style={{
                background: "#10b98115",
                border: "1px solid #10b981",
              }}
            >
              <Check
                size={14}
                className="mt-0.5 shrink-0"
                style={{ color: "#10b981" }}
              />
              <p style={{ color: "#10b981" }}>
                Code verified! Now set your new password.
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
                  style={inputStyle}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm password"
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
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                "Resetting..."
              ) : (
                <>
                  <Check size={16} /> Reset & Login
                </>
              )}
            </button>
          </form>
        )}

        <p
          className="text-center mt-5 sm:mt-6 text-xs sm:text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}