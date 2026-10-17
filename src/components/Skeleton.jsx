/* ═══════════════════════════════════════════ */
/* 🎯 SKELETON LOADERS — Reusable Components   */
/* ═══════════════════════════════════════════ */

/* 🎨 Base shimmer effect */
function Shimmer({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        background: "var(--bg-primary)",
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          animation: "shimmer 1.5s infinite",
          backgroundSize: "1000px 100%",
        }}
      />
    </div>
  );
}

/* ───── 1. Product Card Skeleton ───── */
export function ProductCardSkeleton() {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Image */}
      <Shimmer className="aspect-square rounded-none" />

      {/* Info */}
      <div className="p-3 sm:p-4 space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Shimmer className="h-5 w-16" />
          <Shimmer className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/* ───── 2. Product Grid Skeleton ───── */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ───── 3. Product Detail Skeleton ───── */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-5 sm:py-10 animate-pulse">
      <Shimmer className="h-4 w-24 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        {/* Image */}
        <Shimmer className="aspect-square rounded-2xl" />

        {/* Info */}
        <div className="space-y-4">
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-8 w-24" />
          <Shimmer className="h-20 w-full" />
          <div className="flex gap-3">
            <Shimmer className="h-12 flex-1" />
            <Shimmer className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── 4. Order Card Skeleton ───── */
export function OrderCardSkeleton() {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex gap-3 mb-3">
        <Shimmer className="h-6 w-24 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Shimmer className="w-14 h-14 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

/* ───── 5. Order List Skeleton ───── */
export function OrderListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ───── 6. Cart Item Skeleton ───── */
export function CartItemSkeleton() {
  return (
    <div
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <Shimmer className="w-20 h-20 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-4 w-16" />
        <Shimmer className="h-8 w-24" />
      </div>
    </div>
  );
}

/* ───── 7. Table/Stats Skeleton ───── */
export function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <Shimmer className="w-10 h-10 rounded-lg" />
      <Shimmer className="h-3 w-20" />
      <Shimmer className="h-7 w-16" />
    </div>
  );
}

/* ───── 8. Profile Skeleton ───── */
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Shimmer className="h-32 sm:h-40 rounded-2xl mb-4" />
      <div className="flex gap-4 mb-6">
        <Shimmer className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2 pt-8">
          <Shimmer className="h-6 w-40" />
          <Shimmer className="h-4 w-56" />
        </div>
      </div>
      <div className="space-y-3">
        <Shimmer className="h-12 w-full" />
        <Shimmer className="h-12 w-full" />
        <Shimmer className="h-20 w-full" />
      </div>
    </div>
  );
}

/* ───── 9. Blog/Content Skeleton ───── */
export function ContentSkeleton() {
  return (
    <div className="space-y-3">
      <Shimmer className="h-6 w-3/4" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-2/3" />
    </div>
  );
}

/* ───── 10. Full Page Loading ───── */
export function PageLoader({ message = "Loading..." }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full border-4 animate-spin"
          style={{
            borderColor: "var(--border)",
            borderTopColor: "var(--accent)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-4 animate-spin"
          style={{
            borderColor: "transparent",
            borderTopColor: "var(--secondary)",
            animationDirection: "reverse",
            animationDuration: "1.5s",
          }}
        />
      </div>

      <p
        className="text-sm font-medium animate-pulse"
        style={{ color: "var(--text-secondary)" }}
      >
        {message}
      </p>
    </div>
  );
}

/* ───── 11. Inline Spinner ───── */
export function Spinner({ size = 20, color = "var(--accent)" }) {
  return (
    <div
      className="rounded-full border-2 animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: "var(--border)",
        borderTopColor: color,
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

/* ───── 12. Branded Loading (3 dots) ───── */
export function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            animation: `pulse-slow 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  OrderCardSkeleton,
  OrderListSkeleton,
  CartItemSkeleton,
  StatCardSkeleton,
  ProfileSkeleton,
  ContentSkeleton,
  PageLoader,
  Spinner,
  LoadingDots,
};