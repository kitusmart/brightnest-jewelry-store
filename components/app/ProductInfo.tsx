"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // 🟢 Stock & Discount Logic
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) return;

    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. HEADER SECTION (Name, Price, Stock) */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight uppercase leading-snug">
          {product.name}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {/* Main Selling Price */}
              <p className="text-2xl font-bold text-[#D4AF37]">
                ${product.price?.toLocaleString("en-AU")}
              </p>

              {/* 🔴 NEW: Slashed Price and Discount Badge */}
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ${product.compareAtPrice?.toLocaleString("en-AU")}
                  </span>
                  <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Savings Subtitle */}
            {hasDiscount && (
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">
                Save $
                {(product.compareAtPrice - product.price).toLocaleString(
                  "en-AU",
                )}{" "}
                today
              </p>
            )}
          </div>

          {/* Stock Status Badge */}
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              isOutOfStock
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-green-50 text-green-700 border-green-100"
            }`}
          >
            {isOutOfStock ? "Sold Out" : `${product.stock} In Stock`}
          </div>
        </div>
      </div>

      {/* 🟢 2. JEWELRY DETAILS GRID (Material, Color, Weight) */}
      <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
        {/* Material */}
        <div className="flex flex-col gap-1 border-r border-gray-100 last:border-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Material
          </span>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {product.material || "N/A"}
          </span>
        </div>

        {/* Color */}
        <div className="flex flex-col gap-1 border-r border-gray-100 last:border-0 pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Color
          </span>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {product.color || "N/A"}
          </span>
        </div>

        {/* Weight */}
        <div className="flex flex-col gap-1 pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Weight
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {product.weight || "-"}
          </span>
        </div>
      </div>

      {/* 3. ACTIONS SECTION */}
      <div className="flex flex-col gap-4">
        {/* Quantity Selector */}
        <div
          className={`flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-white ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
        >
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Quantity
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg transition-colors"
            >
              −
            </button>
            <span className="font-bold text-gray-900 w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded || isOutOfStock}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : isAdded
                ? "bg-green-700 text-white cursor-default"
                : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
          }`}
        >
          {isOutOfStock
            ? "Sold Out"
            : isAdded
              ? "Added to Bag ✓"
              : "Add to Basket"}
        </button>

        {/* AI Button */}
        <button className="w-full bg-[#FF6B00]/10 text-[#FF6B00] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all duration-300">
          ✨ Ask AI for Similar Products
        </button>
      </div>

      {/* 4. DESCRIPTION TEXT */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Description
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-light">
          {product.description ||
            "Indulge in the unmatched elegance of our handcrafted collections."}
        </p>
      </div>
    </div>
  );
}
