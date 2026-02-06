"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, [clearCart]);

  return null;
}
