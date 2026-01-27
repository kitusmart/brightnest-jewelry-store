"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // 🟢 NEW: Check if the item is completely sold out
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    // 🟢 NEW: Extra safety - don't add if quantity exceeds stock
    if (quantity > product.stock) return;

    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight uppercase">
          {product.name}
        </h1>
        <p className="text-2xl font-bold text-[#D4AF37]">
          ${product.price?.toLocaleString("en-AU")}
        </p>

        {/* 🟢 NEW: Show current stock status */}
        <p
          className={`text-[11px] font-bold uppercase tracking-widest ${isOutOfStock ? "text-red-500" : "text-green-600"}`}
        >
          {isOutOfStock
            ? "❌ Sold Out"
            : `✅ ${product.stock} pieces Available`}
        </p>
      </div>

      {/* 🔢 Modern Quantity Selector */}
      <div
        className={`flex items-center border border-gray-200 rounded-lg w-full max-w-[400px] h-12 bg-white overflow-hidden ${isOutOfStock ? "opacity-30 pointer-events-none" : ""}`}
      >
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex-1 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
        >
          −
        </button>
        <span className="flex-1 text-center font-bold text-sm border-x border-gray-100">
          {quantity}
        </span>
        <button
          // 🟢 NEW: Prevent increasing quantity past the stock limit
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="flex-1 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
        >
          +
        </button>
      </div>

      {/* 🛒 PRO BUTTON */}
      <button
        onClick={handleAddToCart}
        // 🟢 NEW: Disable button if out of stock OR recently added
        disabled={isAdded || isOutOfStock}
        className={`w-full max-w-[400px] py-4 rounded-lg font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-md active:scale-95 ${
          isOutOfStock
            ? "bg-gray-400 text-white cursor-not-allowed shadow-none"
            : isAdded
              ? "bg-green-600 text-white cursor-default"
              : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
        }`}
      >
        {isOutOfStock
          ? "Out of Stock 🚫"
          : isAdded
            ? "Added to Bag! ✓"
            : "Add to Basket 🛍️"}
      </button>

      <button className="w-full max-w-[400px] bg-[#e65100] text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
        ✨ Ask AI for similar products
      </button>

      <div className="mt-4 text-[13px] text-gray-500 leading-relaxed border-t border-gray-100 pt-6">
        {product.description ||
          "Indulge in the unmatched elegance of our handcrafted collections."}
      </div>
    </div>
  );
}
