import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useReviews = create(
  persist(
    (set, get) => ({
      reviews: {},

      addReview: (productId, review) => {
        const id = `REV-${Date.now()}`;
        const newReview = {
          ...review,
          id,
          date: new Date().toISOString(),
          updatedAt: null,
        };
        set({
          reviews: {
            ...get().reviews,
            [productId]: [newReview, ...(get().reviews[productId] || [])],
          },
        });
        return newReview;
      },

      updateReview: (productId, reviewId, updates) => {
        set({
          reviews: {
            ...get().reviews,
            [productId]: (get().reviews[productId] || []).map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                  }
                : r
            ),
          },
        });
      },

      deleteReview: (productId, reviewId) => {
        set({
          reviews: {
            ...get().reviews,
            [productId]: (get().reviews[productId] || []).filter(
              (r) => r.id !== reviewId
            ),
          },
        });
      },

      getProductReviews: (productId) =>
        productId ? get().reviews[productId] || [] : [],

      getAverageRating: (productId) => {
        const list = productId ? get().reviews[productId] || [] : [];
        if (list.length === 0) return 0;
        return (
          list.reduce((sum, r) => sum + r.rating, 0) / list.length
        ).toFixed(1);
      },
    }),
    { name: "shop-reviews" }
  )
);