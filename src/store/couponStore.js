import { create } from "zustand";
import { persist } from "zustand/middleware";

// 🎟️ Available coupons (you can manage these)
const DEFAULT_COUPONS = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 500,
    maxDiscount: 500,
    description: "10% off on first order",
    active: true,
  },
  {
    code: "SAVE200",
    type: "fixed",
    value: 200,
    minOrder: 1000,
    description: "৳200 off on orders above ৳1000",
    active: true,
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 100,
    minOrder: 0,
    description: "Free delivery",
    active: true,
  },
];

export const useCoupons = create(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,

      applyCoupon: (code, subtotal, deliveryCharge) => {
        const clean = code.toUpperCase().trim();
        const coupon = get().coupons.find(
          (c) => c.code === clean && c.active
        );

        if (!coupon) {
          return { success: false, error: "Invalid coupon code" };
        }

        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            error: `Minimum order ৳${coupon.minOrder} required`,
          };
        }

        let discount = 0;
        let freeDelivery = false;

        if (coupon.type === "percent") {
          discount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.type === "fixed") {
          discount = Math.min(coupon.value, subtotal);
        } else if (coupon.type === "shipping") {
          discount = deliveryCharge;
          freeDelivery = true;
        }

        return {
          success: true,
          coupon,
          discount,
          freeDelivery,
        };
      },

      addCoupon: (coupon) => {
        set({ coupons: [...get().coupons, coupon] });
      },

      removeCoupon: (code) => {
        set({ coupons: get().coupons.filter((c) => c.code !== code) });
      },

      toggleCoupon: (code) => {
        set({
          coupons: get().coupons.map((c) =>
            c.code === code ? { ...c, active: !c.active } : c
          ),
        });
      },
    }),
    { name: "shop-coupons" }
  )
);