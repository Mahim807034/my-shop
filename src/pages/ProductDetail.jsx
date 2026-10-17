import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Copy,
  MessageCircle,
  X,
  Package,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { useProducts } from "../store/productStore";
import { useCart } from "../store/cartStore";
import { useSettings } from "../store/settingsStore";
import { useWishlist } from "../store/wishlistStore";
import { useReviews } from "../store/reviewStore";
import { useAuth } from "../store/authStore";
import { useRecent } from "../store/recentStore";
import { useLanguage } from "../store/languageStore";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import ImageGallery from "../components/ImageGallery";
import Breadcrumbs from "../components/Breadcrumbs";
import RecentlyViewed from "../components/RecentlyViewed";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const products = useProducts((s) => s.products);
  const addItem = useCart((s) => s.addItem);
  const settings = useSettings((s) => s.settings);
  const { toggleItem, isInWishlist } = useWishlist();
  const { addReview, updateReview, deleteReview } = useReviews();
  const user = useAuth((s) => s.user);
  const addRecent = useRecent((s) => s.addProduct);
  const { t } = useLanguage();

  const allReviews = useReviews((s) => s.reviews);

  const product = products.find((p) => String(p.id) === String(id));

  const reviews = product ? allReviews[product.id] || [] : [];
  const currency = settings.currency || "৳";
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      addRecent(product);
    }
  }, [product, addRecent]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.category === product.category && String(p.id) !== String(product.id)
      )
      .slice(0, 4);
  }, [products, product]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === star).length /
            reviews.length) *
            100
        )
      : 0,
  }));

  const getDiscount = () => {
    if (qty >= 10) return 15;
    if (qty >= 5) return 10;
    if (qty >= 3) return 5;
    return 0;
  };

  const discount = product ? getDiscount() : 0;
  const priceAfterDiscount =
    product && discount
      ? Math.round(product.price * (1 - discount / 100))
      : product?.price || 0;
  const totalPrice = priceAfterDiscount * qty;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1
          className="text-xl sm:text-2xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {t("noProductsFound")}
        </h1>
        <Link
          to="/products"
          className="hover:underline text-sm cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          {t("back")} → {t("products")}
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty} × ${product.name}`);
  };

  const orderWhatsApp = () => {
    const msg = `Hi, I want to order:%0A%0AProduct: ${product.name}%0APrice: ${currency}${priceAfterDiscount}%0AQuantity: ${qty}%0A%0ATotal: ${currency}${totalPrice}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, "_blank");
  };

  const handleWishlist = () => {
    const added = toggleItem(product);
    toast.success(added ? `✓ ${t("wishlist")}` : `× ${t("wishlist")}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on ${settings.siteName}!\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (editingReviewId) {
      updateReview(product.id, editingReviewId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      toast.success("Review updated!");
    } else {
      addReview(product.id, {
        name: user?.name || "Anonymous",
        email: user?.email || "",
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      toast.success("Review submitted!");
    }

    setReviewForm({ rating: 5, comment: "" });
    setShowReviewForm(false);
    setEditingReviewId(null);
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
    setShowReviewForm(true);
    setTimeout(() => {
      document
        .getElementById("review-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleDeleteReview = (reviewId) => {
    if (confirm("Delete your review permanently?")) {
      deleteReview(product.id, reviewId);
      toast.success("Review deleted");
    }
  };

  const handleCancelForm = () => {
    setShowReviewForm(false);
    setEditingReviewId(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const isOwnReview = (review) => {
    if (!user) return false;
    return review.email === user.email || review.name === user.name;
  };

  const userHasReviewed = reviews.some((r) => isOwnReview(r));

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images;
    }
    if (product.image) return [product.image];
    return [];
  }, [product]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 sm:py-10">
      <Breadcrumbs
        customItems={[
          { label: t("home"), to: "/" },
          { label: t("products"), to: "/products" },
          { label: product.name, to: `/product/${product.id}` },
        ]}
      />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 sm:mb-6 transition hover:-translate-x-1 text-sm sm:text-base cursor-pointer"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} className="sm:hidden" />
        <ArrowLeft size={18} className="hidden sm:block" />
        {t("back")}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-12">
        {/* LEFT — Gallery */}
        <div>
          <div className="relative">
            <ImageGallery images={galleryImages} alt={product.name} />

            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-20"
              style={{
                background: inWishlist ? "#ef4444" : "var(--bg-secondary)",
                color: inWishlist ? "white" : "var(--text-primary)",
              }}
              aria-label={t("wishlist")}
              aria-pressed={inWishlist}
            >
              <Heart size={18} fill={inWishlist ? "white" : "none"} />
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer z-20"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              aria-label={t("share")}
            >
              <Share2 size={18} />
            </button>

            {discount > 0 && (
              <div
                className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-scaleIn z-20"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                }}
              >
                {discount}% {t("save")}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: Truck, label: t("freeDelivery") },
              { icon: Shield, label: t("warranty") },
              { icon: RefreshCw, label: t("returnPolicy") },
            ].map((b) => (
              <div
                key={b.label}
                className="p-3 rounded-xl border text-center"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <b.icon
                  size={18}
                  className="mx-auto mb-1"
                  style={{ color: "var(--accent)" }}
                />
                <p
                  className="text-[10px] sm:text-xs font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Info */}
        <div className="flex flex-col">
          <p
            className="text-xs sm:text-sm mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.category}
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <StarRating
              rating={Number(avgRating)}
              size={16}
              showValue
              totalReviews={reviews.length}
            />
            <button
              onClick={() => setActiveTab("reviews")}
              className="text-xs hover:underline cursor-pointer"
              style={{ color: "var(--accent)" }}
            >
              {reviews.length} {t("reviews")}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-500">
              {t("inStock")}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              • 25
            </span>
          </div>

          <div className="flex items-end gap-3 mb-6 flex-wrap">
            <p
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {currency}
              {priceAfterDiscount}
            </p>
            {discount > 0 && (
              <>
                <p
                  className="text-lg line-through"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {currency}
                  {product.price}
                </p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#ef4444" }}
                >
                  {t("save")} {currency}
                  {product.price - priceAfterDiscount}
                </span>
              </>
            )}
          </div>

          <p
            className="text-sm sm:text-base mb-6 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mb-5">
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <span
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {t("quantity")}:
              </span>
              <div
                className="flex items-center gap-3 border rounded-lg px-3 py-1"
                style={{ borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-1 transition hover:scale-110 cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Minus size={16} />
                </button>
                <span
                  className="w-8 text-center font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-1 transition hover:scale-110 cursor-pointer"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {t("total")}: {currency}
                {totalPrice.toLocaleString()}
              </span>
            </div>

            <div
              className="p-3 rounded-lg text-xs flex items-center gap-2"
              style={{ background: "var(--bg-secondary)" }}
            >
              <Package size={14} style={{ color: "var(--accent)" }} />
              <div style={{ color: "var(--text-secondary)" }}>
                {qty >= 10 ? (
                  <span className="font-semibold text-green-500">
                    🎉 15% {t("save")}!
                  </span>
                ) : qty >= 5 ? (
                  <span>
                    +{10 - qty} → <strong>15% {t("save")}</strong>
                  </span>
                ) : qty >= 3 ? (
                  <span>
                    +{5 - qty} → <strong>10% {t("save")}</strong>
                  </span>
                ) : (
                  <span>
                    3+ → <strong>5%</strong> • 5+ → <strong>10%</strong> • 10+ →{" "}
                    <strong>15%</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAdd}
              className="w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 border-2 cursor-pointer"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
              }}
            >
              <ShoppingCart size={18} /> {t("addToCart")}
            </button>

            <button
              onClick={orderWhatsApp}
              className="w-full px-6 py-3 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              }}
            >
              <MessageCircle size={18} /> {t("orderWhatsApp")}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="rounded-2xl border overflow-hidden mb-12"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex border-b overflow-x-auto scrollbar-hide"
          style={{ borderColor: "var(--border)" }}
          role="tablist"
        >
          {[
            { key: "description", label: t("description") },
            { key: "specs", label: t("specifications") },
            { key: "reviews", label: `${t("reviews")} (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 sm:px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-all cursor-pointer hover:scale-105 relative"
              style={{
                color:
                  activeTab === tab.key
                    ? "var(--accent)"
                    : "var(--text-secondary)",
              }}
              role="tab"
              aria-selected={activeTab === tab.key}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "description" && (
            <div className="animate-fadeIn">
              <h3
                className="font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {t("description")}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="animate-fadeIn">
              <h3
                className="font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {t("specifications")}
              </h3>
              <div className="space-y-2">
                {[
                  { label: t("category"), value: product.category },
                  { label: t("brand"), value: settings.siteName || "My Shop" },
                  { label: t("material"), value: "Premium Quality" },
                  { label: t("warranty"), value: "1 Year" },
                  { label: t("country"), value: "Bangladesh" },
                  { label: "SKU", value: `SKU-${product.id}` },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {spec.label}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-fadeIn">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div
                  className="p-5 rounded-xl text-center"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <p
                    className="text-5xl font-bold mb-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {avgRating}
                  </p>
                  <StarRating
                    rating={Number(avgRating)}
                    size={20}
                    interactive={false}
                  />
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    ({reviews.length} {t("reviews")})
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  {ratingBreakdown.map((r) => (
                    <div key={r.star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.star}
                        </span>
                        <Star
                          size={12}
                          fill="#f59e0b"
                          style={{ color: "#f59e0b" }}
                        />
                      </div>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-primary)" }}
                      >
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${r.percent}%`,
                            background:
                              "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs w-10 text-right"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {r.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {user ? (
                !showReviewForm ? (
                  !userHasReviewed ? (
                    <button
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm({ rating: 5, comment: "" });
                        setShowReviewForm(true);
                      }}
                      className="w-full sm:w-auto mb-6 px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}
                    >
                      ✍️ {t("writeReview")}
                    </button>
                  ) : (
                    <div
                      className="mb-6 p-3 rounded-lg flex items-center gap-2 text-xs"
                      style={{
                        background: "#10b98115",
                        border: "1px solid #10b981",
                        color: "#10b981",
                      }}
                    >
                      <Check size={14} />
                      <span>✓ {t("reviews")}</span>
                    </div>
                  )
                ) : (
                  <form
                    id="review-form"
                    onSubmit={handleSubmitReview}
                    className="mb-6 p-4 rounded-xl border-2 animate-fadeIn"
                    style={{
                      borderColor: editingReviewId
                        ? "#3b82f6"
                        : "var(--accent)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {editingReviewId ? (
                          <>
                            <Edit size={16} style={{ color: "#3b82f6" }} />
                            <h4
                              className="font-bold"
                              style={{ color: "#3b82f6" }}
                            >
                              Edit Review
                            </h4>
                          </>
                        ) : (
                          <h4
                            className="font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {t("writeReview")}
                          </h4>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="p-1 rounded cursor-pointer hover:scale-110"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mb-3">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Rating
                      </label>
                      <StarRating
                        rating={reviewForm.rating}
                        size={28}
                        interactive
                        onRating={(r) =>
                          setReviewForm({ ...reviewForm, rating: r })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {t("reviews")}
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition text-sm resize-none"
                        style={{
                          background: "var(--bg-primary)",
                          color: "var(--text-primary)",
                          borderColor: "var(--border)",
                        }}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="px-4 py-2 rounded-lg border text-sm cursor-pointer hover:scale-105"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:scale-105 flex items-center gap-1.5"
                        style={{
                          background: editingReviewId
                            ? "#3b82f6"
                            : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                        }}
                      >
                        {editingReviewId ? (
                          <>
                            <Check size={14} /> {t("saveChanges")}
                          </>
                        ) : (
                          <>
                            <Send size={14} /> {t("reviews")}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div
                  className="mb-6 p-4 rounded-lg flex items-center justify-between gap-3"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("login")}
                  </p>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    }}
                  >
                    {t("login")}
                  </Link>
                </div>
              )}

              {reviews.length === 0 ? (
                <div
                  className="text-center py-8 rounded-lg"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <Star
                    size={32}
                    className="mx-auto mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("noProducts")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => {
                    const own = isOwnReview(r);
                    const isEditing = editingReviewId === r.id;
                    return (
                      <div
                        key={r.id}
                        className="p-4 rounded-xl border transition-all"
                        style={{
                          borderColor: isEditing
                            ? "#3b82f6"
                            : "var(--border)",
                          background: isEditing ? "#3b82f610" : "transparent",
                          opacity: isEditing ? 0.6 : 1,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                              }}
                            >
                              {r.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p
                                  className="font-semibold text-sm"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {r.name}
                                </p>
                                {own && (
                                  <span
                                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                                    }}
                                  >
                                    You
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-[10px]"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {new Date(r.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size={14} />
                        </div>
                        <p
                          className="text-sm leading-relaxed mb-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {r.comment}
                        </p>

                        {own && !isEditing && (
                          <div
                            className="flex gap-2 pt-2 border-t"
                            style={{ borderColor: "var(--border)" }}
                          >
                            <button
                              onClick={() => handleEditReview(r)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                              style={{
                                background: "#3b82f620",
                                color: "#3b82f6",
                              }}
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                              style={{
                                background: "#ef444420",
                                color: "#ef4444",
                              }}
                            >
                              <Trash2 size={12} /> {t("remove")}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-xl sm:text-2xl font-bold mb-5"
            style={{ color: "var(--text-primary)" }}
          >
            {t("relatedProducts")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <RecentlyViewed currentProductId={product.id} />

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-scaleIn"
            style={{ background: "var(--bg-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {t("share")}
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg cursor-pointer hover:scale-110"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={shareWhatsApp}
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                style={{ background: "#10b98120", color: "#10b981" }}
              >
                <MessageCircle size={20} />
                <span className="font-semibold text-sm">WhatsApp</span>
              </button>

              <button
                onClick={shareFacebook}
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                style={{ background: "#3b82f620", color: "#3b82f6" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-semibold text-sm">Facebook</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                <span className="font-semibold text-sm">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}