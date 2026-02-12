"use client";

import { formatPrice } from "@/lib/utils";
import {
  useTotalPrice,
  useTotalItems,
  useCartActions,
} from "@/lib/store/cart-store-provider";

interface CartSummaryProps {
  hasStockIssues?: boolean;
  onCheckout: () => void; // <--- NEW PROP: Accepts the signal from Parent
}

export function CartSummary({
  hasStockIssues = false,
  onCheckout,
}: CartSummaryProps) {
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();

  if (totalItems === 0) return null;

  return (
    <div className="pt-6">
      {/* 1. SUBTOTAL */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1B2A4E]">
          Subtotal
        </span>
        <span className="text-2xl font-bold text-[#1B2A4E]">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <p className="text-[10px] text-gray-400 italic font-light tracking-widest mb-8">
        Shipping and taxes calculated at checkout.
      </p>

      {/* 2. CHECKOUT ACTION - The "Nimee" Buy Now Makeover */}
      <div className="space-y-6">
        {hasStockIssues ? (
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed border border-gray-200"
          >
            Resolve stock issues to checkout
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => {
                // We REMOVED the direct redirect here.
                // Now we just tell the parent "User wants to buy"
                onCheckout();
              }}
              className="group relative flex w-full items-center justify-center bg-[#1B2A4E] text-white py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-500 shadow-xl active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <span>Buy Now</span>

                {/* Overlapping Rounded Icons inside the button */}
                <div className="flex -space-x-2 ml-1 items-center">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-[2px] border border-white shadow-sm overflow-hidden">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-[2px] border border-white shadow-sm overflow-hidden">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                      alt="Apple Pay"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-[2px] border border-white shadow-sm overflow-hidden">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <span className="font-serif text-lg leading-none ml-1 transition-transform group-hover:translate-x-1">
                  &gt;
                </span>
              </div>
            </button>

            {/* 3. AUSTRALIAN PAYMENT ICONS - Trust Badges below button */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-3 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                alt="Amex"
                className="h-4 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                alt="Apple Pay"
                className="h-4 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="text-[8px] font-black border border-black/40 px-1 rounded-sm opacity-60">
                AFTERPAY
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. CONTINUE SHOPPING */}
      <div className="mt-8 text-center">
        <button
          onClick={() => closeCart()}
          className="text-[10px] font-bold text-[#1B2A4E] uppercase tracking-[0.3em] border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-all"
        >
          — or continue shopping —
        </button>
      </div>
    </div>
  );
}
