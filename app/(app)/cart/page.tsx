"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // --- MODERN STRIPE CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    try {
      // 1. Create the Checkout Session via your API route
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 2. NEW REDIRECT METHOD:
      // Use window.location.href with the URL returned from your API route.
      // This fixes the "redirectToCheckout is no longer supported" error.
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server.");
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      alert(
        `Checkout Error: ${err.message || "Please check your Stripe configuration."}`,
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 bg-white">
        <div className="p-8 bg-[#fbf7ed] rounded-full">
          <ShoppingBag size={48} className="text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl font-serif tracking-widest text-[#D4AF37] uppercase">
          Your Bag is Empty
        </h1>
        <Link
          href="/"
          className="bg-black text-white px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-12 border-b border-[#fbf7ed] pb-6">
          Shopping Bag
        </h1>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* 🛍️ LEFT SIDE: PRODUCT LIST */}
          <div className="w-full lg:w-3/5 space-y-10">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-row gap-8 items-start border-b border-gray-50 pb-10 last:border-0"
              >
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow flex flex-col min-h-[128px] md:min-h-[176px]">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {item.name}
                    </h3>

                    {item.quantity > 1 && (
                      <span className="text-xl font-black text-gray-900 ml-4">
                        ${(item.price * item.quantity).toLocaleString("en-AU")}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {item.quantity > 1 && (
                      <p className="text-[#D4AF37] text-xs font-bold">
                        Unit Price: ${item.price.toLocaleString("en-AU")}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-4">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-red-400 mt-auto hover:text-red-600 transition-colors w-fit pt-6"
                  >
                    <Trash2 size={12} /> Remove Piece
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-[10px] font-bold text-gray-200 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
            >
              — Reset Bag
            </button>
          </div>

          {/* 💳 RIGHT SIDE: SUMMARY SIDEBAR */}
          <div className="w-full lg:w-2/5 sticky top-32">
            <div className="bg-[#fbf7ed] p-12 rounded-[3.5rem] border border-[#f5edd5] shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] mb-12 text-[#D4AF37] text-center">
                Summary
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900">
                    ${subtotal.toLocaleString("en-AU")}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-gray-400">
                  <span>Standard Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-[#f5edd5] pt-10 mb-12 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">
                    ${subtotal.toLocaleString("en-AU")}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">
                    AUD
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-center shadow-2xl hover:bg-[#D4AF37] hover:text-black transition-all group active:scale-[0.98]"
              >
                Checkout Now
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="mt-10 flex items-center justify-center gap-8 opacity-20 grayscale scale-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  className="h-4"
                  alt="PayPal"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  className="h-3"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  className="h-6"
                  alt="Mastercard"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
