"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Check, Heart } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Luxury Skeleton loader while mounting
  if (!isMounted) {
    return (
      <div className="flex flex-col animate-pulse">
        <div className="aspect-[4/5] bg-gray-50 rounded-sm" />
        <div className="mt-4 h-4 w-3/4 bg-gray-50 mx-auto" />
        <div className="mt-2 h-4 w-1/4 bg-gray-50 mx-auto" />
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-500 border border-transparent hover:shadow-2xl hover:shadow-gray-100">
      {/* 🖼️ IMAGE SECTION */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#F9F9F9]"
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-[4/5] object-cover transition-opacity duration-1000 group-hover:opacity-0"
        />
        {/* Hover Image */}
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-auto aspect-[4/5] object-cover opacity-0 transition-all duration-1000 group-hover:opacity-100 scale-110 group-hover:scale-100"
        />

        {/* 🤍 WISHLIST ICON */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#1B2A4E] hover:text-white"
        >
          <Heart
            size={14}
            className={`transition-colors ${isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-400"}`}
          />
        </button>

        {/* 🏷️ LUXURY BADGE */}
        {product.badge && !isOutOfStock && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[8px] font-black text-[#1B2A4E] border border-gray-100 uppercase tracking-[0.2em]">
              {product.badge}
            </div>
          </div>
        )}

        {/* 🔴 REFINED SALE TAG */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-[#1B2A4E] px-3 py-1.5 text-[8px] font-black text-[#D4AF37] rounded-none shadow-xl uppercase tracking-[0.25em] border border-[#D4AF37]/40">
              Limited Offer
            </div>
          </div>
        )}

        {/* 🔍 QUICK VIEW BAR */}
        <div className="absolute inset-x-0 bottom-0 bg-[#1B2A4E]/90 backdrop-blur-md py-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <span className="text-white text-[9px] font-bold uppercase tracking-[0.3em]">
            Discover Piece
          </span>
        </div>
      </Link>

      {/* 📝 CONTENT SECTION */}
      <div className="pt-6 pb-4 flex flex-col items-center text-center px-4">
        <Link href={`/products/${product.slug}`} className="w-full">
          <h3 className="text-[#1B2A4E] text-[12px] font-medium leading-relaxed mb-2 line-clamp-2 min-h-[36px] uppercase tracking-[0.1em] group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* 💰 PRICE SECTION */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[14px] font-bold text-[#1B2A4E]">
            ${product.price?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-300 line-through font-light italic">
              ${product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* 🛒 ADD TO CART BUTTON */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-3.5 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-2 border ${
            isAdded
              ? "bg-[#D4AF37] border-[#D4AF37] text-white"
              : "bg-transparent border-[#1B2A4E]/10 text-[#1B2A4E] hover:bg-[#1B2A4E] hover:border-[#1B2A4E] hover:text-white"
          } ${isOutOfStock ? "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-300" : ""}`}
        >
          {isAdded ? (
            <>
              <Check size={12} strokeWidth={3} /> Added to Nest
            </>
          ) : isOutOfStock ? (
            "Archive Only"
          ) : (
            "Purchase Now"
          )}
        </button>
      </div>
    </div>
  );
}