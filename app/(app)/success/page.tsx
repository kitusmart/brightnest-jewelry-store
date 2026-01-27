"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // This automatically empties the cart after a successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-8 p-6 bg-[#fbf7ed] rounded-full animate-in zoom-in duration-700">
          <CheckCircle size={64} className="text-[#D4AF37]" />
        </div>

        <h1 className="text-4xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-4">
          Order Confirmed
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed tracking-wide mb-10 uppercase font-medium">
          Thank you for choosing{" "}
          <span className="text-black font-bold">BRIGHTNEST</span>. Your
          exquisite jewelry is being prepared for delivery. A confirmation email
          has been sent to you.
        </p>

        <div className="flex flex-col w-full gap-4">
          <Link
            href="/"
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Continue Shopping
          </Link>

          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] pt-4">
            Elevate Your Shine
          </p>
        </div>
      </div>
    </div>
  );
}
