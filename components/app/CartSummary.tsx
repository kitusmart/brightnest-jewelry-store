"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  useTotalPrice,
  useTotalItems,
  useCartActions,
} from "@/lib/store/cart-store-provider";

interface CartSummaryProps {
  hasStockIssues?: boolean;
}

export function CartSummary({ hasStockIssues = false }: CartSummaryProps) {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();

  if (totalItems === 0) return null;

  return (
    <div className="pt-6">
      {/* 1. SUBTOTAL: High Contrast Midnight Blue */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1B2A4E]">
          Subtotal
        </span>
        <span className="text-xl font-bold text-[#1B2A4E]">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <p className="text-[10px] text-gray-400 italic font-light tracking-widest mb-8">
        Shipping and taxes calculated at checkout.
      </p>

      {/* 2. CHECKOUT ACTION */}
      <div className="space-y-4">
        {hasStockIssues ? (
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 py-5 text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed border border-gray-200"
          >
            Resolve stock issues to checkout
          </button>
        ) : (
          <Link
            href="/checkout"
            onClick={() => closeCart()}
            className="block w-full bg-[#1B2A4E] text-white py-5 text-center text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-700 shadow-xl active:scale-[0.98]"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>

      {/* 3. CONTINUE SHOPPING: Gold underline style */}
      <div className="mt-8 text-center">
        <button
          onClick={() => closeCart()}
          className="text-[10px] font-bold text-[#1B2A4E] uppercase tracking-[0.3em] border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-all"
        >
          — Continue Shopping —
        </button>
      </div>
    </div>
  );
}
