"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Truck, ShieldCheck, Lock, Sparkles, ChevronRight } from "lucide-react";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Stock & Discount Logic
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

  // Safe category link formatting
  const categoryName = product.category || "Collection";
  const categorySlug = categoryName.toLowerCase();

  return (
    <div className="flex flex-col gap-8">
      {/* BREADCRUMBS SECTION */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">
          Home
        </Link>
        <ChevronRight size={10} />
        {/* Changed from /category/[slug] to /products?category=[slug] to match your shop structure */}
        <Link
          href={`/products?category=${categorySlug}`}
          className="hover:text-[#D4AF37] transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight size={10} />
        <span className="text-gray-900 truncate max-w-[150px]">
          {product.name}
        </span>
      </nav>

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col gap-2 -mt-4">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight uppercase leading-snug">
          {product.name}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-[#D4AF37]">
                ${product.price?.toLocaleString("en-AU")}
              </p>

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

      {/* 2. JEWELRY DETAILS GRID */}
      <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
        <div className="flex flex-col gap-1 border-r border-gray-100 last:border-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Material
          </span>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {product.material || "N/A"}
          </span>
        </div>

        <div className="flex flex-col gap-1 border-r border-gray-100 last:border-0 pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Color
          </span>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {product.color || "N/A"}
          </span>
        </div>

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

        <button className="w-full bg-[#FF6B00]/10 text-[#FF6B00] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
          <Sparkles size={14} /> Ask AI for Similar Products
        </button>

        {/* TRUST BADGES SECTION */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Truck size={18} className="text-[#D4AF37]" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-500 text-center leading-tight">
              Free Insured
              <br />
              Shipping
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-[#D4AF37]" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-500 text-center leading-tight">
              Anti-Tarnish
              <br />
              Guarantee
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Lock size={18} className="text-[#D4AF37]" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-500 text-center leading-tight">
              Secure
              <br />
              Checkout
            </span>
          </div>
        </div>
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
