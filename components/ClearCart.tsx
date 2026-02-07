"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // 1. Clear the Zustand store
    clearCart();

    // 2. Clear the browser's persistent storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("shopping-cart");
      window.dispatchEvent(new Event("storage"));
    }
  }, [clearCart]);

  return null;
}
