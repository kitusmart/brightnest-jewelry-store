"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // This empties the shopping bag after a successful payment
    clearCart();
  }, [clearCart]);

  return null;
}
