"use client";
import { useEffect } from "react";
import { useCartActions } from "@/lib/store/cart-store-provider";

export default function ClearCart() {
  const { clearCart } = useCartActions();

  useEffect(() => {
    // 1. Clear the main Zustand store
    clearCart();

    // 2. Clear any persistent local storage for the cart
    if (typeof window !== "undefined") {
      localStorage.removeItem("shopping-cart");
      localStorage.removeItem("cart-storage");

      // 3. Force the browser to recognize the change immediately
      window.dispatchEvent(new Event("storage"));
    }
  }, [clearCart]);

  return null;
}
