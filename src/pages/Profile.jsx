import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle,
  Shield,
  Store,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { useAdmin } from "../store/adminStore";
import { useLanguage } from "../store/languageStore";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile, deleteAdminAccount } = useAuth();
  const adminLogout = useAdmin((s) => s.logout);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      bio: user.bio || "",
    });
  }, [user, navigate]);

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ avatar: reader.result });
      toast.success("Photo updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    updateProfile(form);
    toast.success(`${t("saveChanges")} ✓`);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      bio: user.bio || "",
    });
    setEditing(false);
  };

  const handleDeleteAdmin = () => {
    deleteAdminAccount();
    adminLogout();
    toast.success(`${t("deleteProfile")} ✓`);
    navigate("/");
  };

  const joinedDate = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] py-6 sm:py-10 px-4 animate-fadeIn"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 sm:mb-6 transition hover:-translate-x-1 text-sm sm:text-base cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} className="sm:hidden" />
          <ArrowLeft size={18} className="hidden sm:block" /> {t("back")}
        </button>

        {/* Admin Panel Switch */}
        {isAdmin && (
          <Link
            to="/admin"
            className="mb-5 p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 animate-fadeIn cursor-pointer shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Store size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base mb-0.5">
                {t("adminPanel")}
              </p>
              <p className="text-white/90 text-xs">{t("viewStore")}</p>
            </div>
            <div className="text-white text-2xl shrink-0">→</div>
          </Link>
        )}

        {/* Header */}
        <div
          className="rounded-2xl shadow-lg overflow-hidden mb-5 sm:mb-6 animate-scaleIn"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div
            className="h-24 sm:h-32 md:h-40 relative"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-5 left-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white blur-3xl animate-pulse-slow"></div>
            </div>

            {isAdmin && (
              <div
                className="absolute top-3 right-3 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-white shadow-lg animate-fadeIn"
                style={{ background: "#8b5cf6" }}
              >
                <Shield size={12} /> Admin
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-12 sm:-mt-16 md:-mt-20 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-3 sm:gap-4">
              <div className="relative group self-center md:self-auto">
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-xl transition-transform hover:scale-105"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: isAdmin ? "#8b5cf6" : "var(--bg-secondary)",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-white"
                      style={{
                        background: isAdmin
                          ? "#8b5cf6"
                          : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 sm:p-3 rounded-full text-white shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  }}
                >
                  <Camera size={14} className="sm:hidden" />
                  <Camera size={18} className="hidden sm:block" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center md:text-left md:pb-2">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <h1
                    className="text-lg sm:text-2xl md:text-3xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.name}
                  </h1>
                  {isAdmin && (
                    <Shield
                      size={16}
                      className="sm:hidden"
                      style={{ color: "#8b5cf6" }}
                    />
                  )}
                  {isAdmin && (
                    <Shield
                      size={20}
                      className="hidden sm:block"
                      style={{ color: "#8b5cf6" }}
                    />
                  )}
                </div>
                <p
                  className="text-xs sm:text-sm flex items-center gap-2 justify-center md:justify-start"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Mail size={14} /> {user.email}
                </p>
                <p
                  className="text-[10px] sm:text-xs flex items-center gap-2 mt-1 justify-center md:justify-start"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Calendar size={12} /> {t("joined")} {joinedDate}
                </p>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm self-center md:self-end cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Edit3 size={14} className="sm:hidden" />
                <Edit3 size={16} className="hidden sm:block" />
                {editing ? t("cancel") : t("editProfile")}
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div
          className="rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-fadeIn delay-100"
          style={{ background: "var(--bg-secondary)" }}
        >
          <h2
            className="text-base sm:text-xl font-bold mb-4 sm:mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            {t("profileDetails")}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            <Field
              icon={<User size={18} />}
              label={t("fullName")}
              value={form.name}
              editing={editing}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder={t("fullNamePlaceholder")}
              inputStyle={inputStyle}
              noValueText={`No ${t("fullName")}`}
            />

            <div>
              <label
                className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("email")}
              </label>
              <div
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border opacity-60 text-sm sm:text-base"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <Mail size={16} style={{ color: "var(--text-secondary)" }} />
                <span
                  className="truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.email}
                </span>
              </div>
            </div>

            <Field
              icon={<Phone size={18} />}
              label={t("phone")}
              value={form.phone}
              editing={editing}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="+880 1XXX-XXXXXX"
              type="tel"
              inputStyle={inputStyle}
              noValueText={t("noPhone")}
            />

            <Field
              icon={<MapPin size={18} />}
              label={t("city")}
              value={form.city}
              editing={editing}
              onChange={(v) => setForm({ ...form, city: v })}
              placeholder="Dhaka"
              inputStyle={inputStyle}
              noValueText={t("noCity")}
            />

            <div className="md:col-span-2">
              <label
                className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("address")}
              </label>
              {editing ? (
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base"
                  style={inputStyle}
                />
              ) : (
                <div
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border min-h-[70px] text-sm sm:text-base"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: form.address
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {form.address || t("noAddress")}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("bio")}
              </label>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base"
                  style={inputStyle}
                />
              ) : (
                <div
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border min-h-[70px] text-sm sm:text-base"
                  style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border)",
                    color: form.bio
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {form.bio || t("noBio")}
                </div>
              )}
              {editing && (
                <p
                  className="text-xs mt-1 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {form.bio.length}/200
                </p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6 sm:mt-8 animate-fadeIn">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Save size={16} className="sm:hidden" />
                <Save size={18} className="hidden sm:block" />{" "}
                {t("saveChanges")}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 border-2 text-sm sm:text-base cursor-pointer"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                }}
              >
                {t("cancel")}
              </button>
            </div>
          )}
        </div>

        {/* Delete Profile */}
        <div
          className="rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mt-5 sm:mt-6 border-2 animate-fadeIn delay-200"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "#ef444440",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#ef444420" }}
            >
              <AlertTriangle size={20} style={{ color: "#ef4444" }} />
            </div>
            <div>
              <h2
                className="text-base sm:text-xl font-bold"
                style={{ color: "#ef4444" }}
              >
                {t("deleteProfile")}
              </h2>
            </div>
          </div>

          <div
            className="p-3 sm:p-4 rounded-lg mb-4 text-xs sm:text-sm"
            style={{ background: "var(--bg-primary)" }}
          >
            <ul
              className="space-y-1 list-disc list-inside"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>Your account will be removed permanently</li>
              {isAdmin && <li>Admin slot will be freed</li>}
              {isAdmin && <li>Another user can register as admin</li>}
            </ul>
            <p className="mt-2 font-semibold" style={{ color: "#ef4444" }}>
              ⚠️ This action cannot be undone.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg text-sm cursor-pointer"
              style={{ background: "#ef4444" }}
            >
              <Trash2 size={16} /> {t("deleteProfile")}
            </button>
          ) : (
            <div
              className="p-4 rounded-xl border-2 animate-scaleIn"
              style={{
                background: "#ef444410",
                borderColor: "#ef4444",
              }}
            >
              <p
                className="text-sm font-bold mb-3 flex items-center gap-2"
                style={{ color: "#ef4444" }}
              >
                <AlertTriangle size={16} />
                Are you absolutely sure?
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleDeleteAdmin}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                  style={{ background: "#ef4444" }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg font-semibold border-2 transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--border)",
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Field Component */
function Field({
  icon,
  label,
  value,
  editing,
  onChange,
  placeholder,
  type = "text",
  inputStyle,
  noValueText,
}) {
  return (
    <div>
      <label
        className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      {editing ? (
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          >
            {icon}
          </span>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 transition text-sm sm:text-base"
            style={inputStyle}
          />
        </div>
      ) : (
        <div
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: value ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>{icon}</span>
          <span className="truncate">{value || noValueText}</span>
        </div>
      )}
    </div>
  );
}