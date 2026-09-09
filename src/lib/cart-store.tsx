"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartLine = { slug: string; quantity: number };

type CartContextValue = {
  items: CartLine[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  // Persisted so checkout charges the same total the cart quoted.
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "sanganie-cart";
const COUPON_KEY = "sanganie-cart-coupon";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      setCouponCode(localStorage.getItem(COUPON_KEY));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (couponCode) localStorage.setItem(COUPON_KEY, couponCode);
    else localStorage.removeItem(COUPON_KEY);
  }, [couponCode, hydrated]);

  const addItem = (slug: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) => (i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { slug, quantity }];
    });
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const updateQuantity = (slug: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
  };
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, couponCode, setCouponCode }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
