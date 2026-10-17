import { useState, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Package,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Tag,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { useProducts } from "../../store/productStore";
import { useLanguage } from "../../store/languageStore";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  price: "",
  image: "",
  images: [],
  description: "",
  category: "",
};

const SUGGESTED_CATEGORIES = [
  "Clothing",
  "Accessories",
  "Electronics",
  "Food",
  "Beverages",
  "Home",
  "Kitchen",
  "Furniture",
  "Beauty",
  "Health",
  "Sports",
  "Fitness",
  "Toys",
  "Books",
  "Stationery",
  "Mobile",
  "Laptop",
  "Gadgets",
  "Shoes",
  "Bags",
  "Jewelry",
  "Watches",
  "Baby",
  "Pet",
  "Automotive",
  "Garden",
  "Tools",
  "Gifts",
  "Art",
  "Music",
  "Other",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 6;

export default function AdminProducts() {
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageMode, setImageMode] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] =
    useState(false);
  const multiFileInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const categorySuggestions = SUGGESTED_CATEGORIES.filter((c) =>
    c.toLowerCase().includes(form.category.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageMode("upload");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images || (product.image ? [product.image] : []),
      description: product.description,
      category: product.category,
    });
    setImageMode(product.image?.startsWith("data:") ? "upload" : "url");
    setShowModal(true);
  };

  const handleMainFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Image file only");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => {
        const newImages = [...(f.images || [])];
        if (!newImages.includes(reader.result)) {
          newImages.unshift(reader.result);
        }
        return {
          ...f,
          image: reader.result,
          images: newImages.slice(0, MAX_IMAGES),
        };
      });
      toast.success("✓");
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleFiles = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 2MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const currentCount = form.images?.length || 0;
    const remaining = MAX_IMAGES - currentCount;

    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images`);
      return;
    }

    const filesToProcess = validFiles.slice(0, remaining);

    Promise.all(
      filesToProcess.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      const validImages = results.filter(Boolean);

      setForm((f) => {
        const currentImages = f.images || [];
        const newImages = [...currentImages, ...validImages];
        return {
          ...f,
          images: newImages,
          image: f.image || newImages[0] || "",
        };
      });

      toast.success(`✓ ${validImages.length}`);
    });
  };

  const handleRemoveImage = (index) => {
    setForm((f) => {
      const newImages = (f.images || []).filter((_, i) => i !== index);
      return {
        ...f,
        images: newImages,
        image: f.image === f.images[index] ? newImages[0] || "" : f.image,
      };
    });
    toast.success(`✓ ${t("removeImage")}`);
  };

  const handleSetMain = (imageUrl) => {
    setForm((f) => ({ ...f, image: imageUrl }));
    toast.success(`✓ ${t("mainImage")}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;

    if (files.length === 1 && !form.image) {
      handleMainFile(files[0]);
    } else if (files.length > 0) {
      handleMultipleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      toast.error(`${t("productName")} ${t("price")} *`);
      return;
    }

    const finalImages = form.images || [];
    const mainImage = form.image || finalImages[0] || "";

    if (!mainImage) {
      toast.error(t("productImage") + " *");
      return;
    }

    if (!form.category.trim()) {
      toast.error(t("category") + " *");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      image: mainImage,
      images: finalImages.length > 0 ? finalImages : [mainImage],
    };

    if (editingId) {
      updateProduct(editingId, payload);
      toast.success(`✓ ${t("update")}`);
    } else {
      addProduct(payload);
      toast.success(`✓ ${t("add")}`);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id, name) => {
    if (confirm(`${t("remove")} "${name}"?`)) {
      removeProduct(id);
      toast.success(`✓ ${t("remove")}`);
    }
  };

  const handleCategoryBlur = () => {
    setTimeout(() => setShowCategorySuggestions(false), 200);
  };

  const inputStyle = {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {t("productsAdmin")}
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {products.length} {t("items")}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-semibold transition hover:scale-[1.02] active:scale-95 shadow-md text-sm cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          }}
        >
          <Plus size={18} /> {t("addProduct")}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          type="text"
          placeholder={t("searchProducts")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <Package
            size={40}
            className="mx-auto mb-3"
            style={{ color: "var(--text-secondary)" }}
          />
          <p
            className="text-sm mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {search ? t("noProductsFound") : t("noProducts")}
          </p>
          {!search && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-semibold text-sm cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            >
              <Plus size={16} /> {t("addProduct")}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border overflow-hidden hover:shadow-lg transition group animate-fadeIn"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />

                {p.images && p.images.length > 1 && (
                  <div
                    className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    }}
                  >
                    <ImageIcon size={10} /> {p.images.length}
                  </div>
                )}
              </div>

              <div className="p-3">
                <span
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b98120 0%, #3b82f620 100%)",
                    color: "var(--accent)",
                  }}
                >
                  {p.category}
                </span>
                <h3
                  className="font-semibold text-sm mb-1 line-clamp-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.name}
                </h3>
                <p
                  className="font-bold mb-3 text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ৳{p.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 py-2 rounded-lg border text-xs font-medium transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Edit size={14} /> {t("editProduct")}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="flex-1 py-2 rounded-lg border text-red-500 text-xs font-medium transition hover:scale-[1.02] active:scale-95 hover:bg-red-500 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <Trash2 size={14} /> {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scaleIn"
            style={{ background: "var(--bg-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b z-10"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {editingId ? t("editProduct") : t("addProduct")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg transition hover:scale-110 active:scale-95 cursor-pointer"
                style={{ color: "var(--text-primary)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("productName")} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Premium T-Shirt"
                  className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("price")} *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="850"
                    className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
                    style={inputStyle}
                  />
                </div>

                <div className="relative">
                  <label
                    className="block text-xs font-medium mb-1.5 flex items-center gap-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Tag size={11} /> {t("category")} *
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value });
                      setShowCategorySuggestions(true);
                    }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    onBlur={handleCategoryBlur}
                    placeholder={t("typeYourOwn")}
                    className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
                    style={inputStyle}
                    autoComplete="off"
                  />

                  {showCategorySuggestions &&
                    categorySuggestions.length > 0 && (
                      <div
                        className="absolute left-0 right-0 mt-1 rounded-lg border shadow-xl overflow-hidden z-30 animate-fadeIn"
                        style={{
                          background: "var(--bg-secondary)",
                          borderColor: "var(--border)",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {categorySuggestions.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setForm({ ...form, category: c });
                              setShowCategorySuggestions(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm transition-all hover:pl-4 cursor-pointer flex items-center gap-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            <Tag size={12} style={{ color: "var(--accent)" }} />
                            {c}
                          </button>
                        ))}
                        {form.category.trim() &&
                          !SUGGESTED_CATEGORIES.some(
                            (c) =>
                              c.toLowerCase() ===
                              form.category.trim().toLowerCase()
                          ) && (
                            <div
                              className="px-3 py-2 text-xs flex items-center gap-2 border-t"
                              style={{
                                background: "#10b98115",
                                color: "#10b981",
                                borderColor: "var(--border)",
                              }}
                            >
                              <Check size={12} />
                              <span>{t("willCreateCategory")}</span>
                            </div>
                          )}
                      </div>
                    )}
                </div>
              </div>

              {/* Images */}
              <div
                className="p-4 rounded-xl border-2"
                style={{
                  background: "var(--bg-primary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <label
                    className="text-xs font-bold flex items-center gap-1.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <ImageIcon size={14} style={{ color: "var(--accent)" }} />
                    {t("productImage")} *
                  </label>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {(form.images?.length || 0)}/{MAX_IMAGES}
                  </span>
                </div>

                <div
                  className="flex gap-1 p-1 rounded-lg mb-3"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className="flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      background:
                        imageMode === "upload"
                          ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                          : "transparent",
                      color:
                        imageMode === "upload"
                          ? "white"
                          : "var(--text-secondary)",
                    }}
                  >
                    <Upload size={14} /> {t("uploadFromDevice")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className="flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      background:
                        imageMode === "url"
                          ? "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
                          : "transparent",
                      color:
                        imageMode === "url"
                          ? "white"
                          : "var(--text-secondary)",
                    }}
                  >
                    <LinkIcon size={14} /> {t("useImageUrl")}
                  </button>
                </div>

                {imageMode === "upload" && (
                  <>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => multiFileInputRef.current?.click()}
                      className="w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] mb-3"
                      style={{
                        background: "var(--bg-secondary)",
                        borderColor: dragging
                          ? "var(--accent)"
                          : "var(--border)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                        }}
                      >
                        <Upload size={22} className="text-white" />
                      </div>
                      <div className="text-center px-3">
                        <p
                          className="font-semibold text-xs mb-0.5"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {dragging ? "Drop here" : t("clickToUpload")}
                        </p>
                        <p
                          className="text-[10px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {t("uploadHint")}
                        </p>
                      </div>
                    </div>

                    <input
                      ref={multiFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        handleMultipleFiles(e.target.files);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleMainFile(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </>
                )}

                {imageMode === "url" && (
                  <div className="space-y-3 mb-3">
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => {
                        const url = e.target.value;
                        setForm((f) => {
                          const newImages = [...(f.images || [])];
                          if (url && !newImages.includes(url)) {
                            newImages.unshift(url);
                          }
                          return {
                            ...f,
                            image: url,
                            images: newImages.slice(0, MAX_IMAGES),
                          };
                        });
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm"
                      style={{
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <p
                      className="text-[10px] flex items-center gap-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <AlertCircle size={10} /> Paste direct image URL
                    </p>
                  </div>
                )}

                {form.images && form.images.length > 0 && (
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t("gallery")} ({form.images.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {form.images.map((img, i) => {
                        const isMain = form.image === img;
                        return (
                          <div
                            key={i}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 group/img transition-all"
                            style={{
                              borderColor: isMain
                                ? "var(--accent)"
                                : "var(--border)",
                            }}
                          >
                            <img
                              src={img}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/200x200?text=?";
                              }}
                            />

                            {isMain && (
                              <div
                                className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-md flex items-center gap-0.5"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                                }}
                              >
                                <Star
                                  size={8}
                                  fill="white"
                                  strokeWidth={0}
                                />
                                {t("mainImage")}
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMain(img)}
                                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
                                >
                                  <Star size={12} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(i)}
                                className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {form.images.length < MAX_IMAGES &&
                        imageMode === "upload" && (
                          <button
                            type="button"
                            onClick={() => multiFileInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                            style={{
                              background: "var(--bg-secondary)",
                              borderColor: "var(--border)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <Plus size={20} />
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("description")}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition resize-none text-sm"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="sticky bottom-0 flex gap-3 p-4 sm:p-5 border-t"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg font-semibold border-2 transition hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                }}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg font-semibold text-white transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-md text-sm cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                }}
              >
                <Save size={16} />
                {editingId ? t("update") : t("add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}