"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Check, Heart } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice > product.price;

  // Image handling
  const mainImage =
    product.image || "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
  const hoverImage = product.images?.[1]?.asset?.url || mainImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    setIsAdded(true);
    toast.success("Added to cart");
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-300 border border-transparent hover:border-gray-100">
      {/* 🖼️ IMAGE SECTION */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#F9F9F9]"
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-square object-cover transition-opacity duration-700 group-hover:opacity-0"
        />
        {/* Hover Image */}
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-auto aspect-square object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
        />

        {/* 🤍 WISHLIST ICON (Top-Right) */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Heart
            size={16}
            className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* 🏷️ LUXURY BADGE (e.g., 18K GOLD) */}
        {product.badge && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-black text-gray-800 border border-gray-100 uppercase tracking-[0.1em]">
              {product.badge}
            </div>
          </div>
        )}

        {/* 🔴 REFINED SALE TAG (Bottom-Left) */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-[#1B2A4E] px-2 py-0.5 text-[8px] font-black text-[#D4AF37] rounded-sm shadow-sm uppercase tracking-widest border border-[#D4AF37]/30">
              Limited Offer
            </div>
          </div>
        )}

        {/* 🔍 QUICK VIEW BAR */}
        <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-gray-100 z-10">
          <span className="text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em]">
            Quick View
          </span>
        </div>
      </Link>

      {/* 📝 CONTENT SECTION */}
      <div className="pt-5 pb-2 flex flex-col items-center text-center px-2">
        <Link href={`/products/${product.slug}`} className="w-full">
          <h3 className="text-[#1B2A4E] text-[13px] font-medium leading-snug mb-2 line-clamp-2 min-h-[40px] uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* 💰 PRICE SECTION */}
        <div className="mb-5 flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.price?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through font-light">
              ${product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* 🛒 ADD TO CART BUTTON */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2 border ${
            isAdded
              ? "bg-green-600 border-green-600 text-white"
              : "bg-transparent border-gray-200 text-gray-900 hover:bg-[#1B2A4E] hover:border-[#1B2A4E] hover:text-white"
          } ${isOutOfStock ? "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-300" : ""}`}
        >
          {isAdded ? (
            <>
              <Check size={14} /> In Bag
            </>
          ) : isOutOfStock ? (
            "Sold Out"
          ) : (
            "Add to Basket"
          )}
        </button>
      </div>
    </div>
  );
}
