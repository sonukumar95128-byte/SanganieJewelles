import type { AdminCoupon } from "@/lib/admin-store";

// Cart and checkout must agree to the rupee, so both compute totals through here.
// Admin stores flat coupon values and minimum order in paise; the storefront works in rupees.
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

export type CouponFailure = "unknown" | "inactive" | "expired" | "below-minimum";

export function findCoupon(coupons: AdminCoupon[], code: string): AdminCoupon | undefined {
  const normalized = code.trim().toUpperCase();
  return coupons.find((c) => c.code.trim().toUpperCase() === normalized);
}

export function validateCoupon(
  coupon: AdminCoupon | undefined,
  subtotal: number
): { ok: true; coupon: AdminCoupon } | { ok: false; reason: CouponFailure } {
  if (!coupon) return { ok: false, reason: "unknown" };
  if (!coupon.active) return { ok: false, reason: "inactive" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date(new Date().toDateString())) {
    return { ok: false, reason: "expired" };
  }
  if (subtotal < coupon.minOrderInPaise / 100) return { ok: false, reason: "below-minimum" };
  return { ok: true, coupon };
}

export function couponErrorMessage(reason: CouponFailure, coupon?: AdminCoupon): string {
  switch (reason) {
    case "unknown":
      return "That coupon code isn't recognised.";
    case "inactive":
      return "That coupon is no longer available.";
    case "expired":
      return "That coupon has expired.";
    case "below-minimum":
      return `Spend ₹${((coupon?.minOrderInPaise ?? 0) / 100).toLocaleString("en-IN")} to use this coupon.`;
  }
}

export function discountFor(coupon: AdminCoupon | undefined, subtotal: number): number {
  if (!coupon) return 0;
  const check = validateCoupon(coupon, subtotal);
  if (!check.ok) return 0;
  const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value / 100;
  // Never discount below zero, and never more than the order is worth.
  return Math.min(Math.round(raw), subtotal);
}

export function shippingFor(subtotal: number): number {
  return subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
}

export function orderTotals(subtotal: number, coupon: AdminCoupon | undefined) {
  const discount = discountFor(coupon, subtotal);
  const shipping = shippingFor(subtotal);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
