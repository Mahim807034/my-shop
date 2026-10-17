import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  size = 16,
  interactive = false,
  onRating = null,
  showValue = false,
  totalReviews = 0,
}) {
  const stars = [1, 2, 3, 4, 5];
  const safeRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={
              interactive && onRating ? () => onRating(star) : undefined
            }
            className={
              interactive
                ? "cursor-pointer transition hover:scale-125"
                : ""
            }
            disabled={!interactive}
            aria-label={`${star} star`}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              display: "inline-flex",
            }}
          >
            <Star
              size={size}
              fill={star <= Math.round(safeRating) ? "#f59e0b" : "transparent"}
              style={{
                color:
                  star <= Math.round(safeRating) ? "#f59e0b" : "var(--border)",
              }}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          {safeRating.toFixed(1)}
          {totalReviews > 0 && (
            <span className="font-normal ml-1">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
}