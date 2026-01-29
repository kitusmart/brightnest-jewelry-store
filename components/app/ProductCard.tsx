"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;

  // 🟢 Discount Logic
  const hasDiscount = product.compareAtPrice > product.price;

  // Get main image and second image for hover effect
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

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-300">
      {/* 🖼️ IMAGE SECTION */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden"
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-square object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* Hover Image */}
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-auto aspect-square object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* 🏷️ EXISTING BADGE (e.g., 18K GOLD) */}
        {product.badge && !isOutOfStock && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-800 border border-gray-100 uppercase tracking-tight">
              {product.badge}
            </div>
          </div>
        )}

        {/* 🔴 NEW: SALE TAG (Appears top-right if there's a discount) */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-red-600 px-2 py-1 text-[10px] font-black text-white rounded shadow-sm uppercase tracking-tighter">
              SALE
            </div>
          </div>
        )}

        {/* 🔍 QUICK VIEW BAR - Appears on Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-white/90 py-2.5 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-t border-gray-100 z-10">
          <span className="text-gray-500 text-sm font-light">Quick View</span>
        </div>
      </Link>

      {/* 📝 CONTENT SECTION */}
      <div className="pt-4 pb-2 flex flex-col items-start text-left">
        <Link href={`/products/${product.slug}`} className="w-full">
          <h3 className="text-[#4A5568] text-[15px] font-normal leading-snug mb-2 line-clamp-2 min-h-[40px] hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* 💰 PRICE SECTION WITH DISCOUNT */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl font-medium text-gray-900">
            ${product.price?.toLocaleString()}
          </span>

          {/* Slashed Original Price */}
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* 🛒 ADD TO CART BUTTON */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-full text-[15px] font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-[#1B2A4E] text-white hover:bg-[#2a3b63]"
          } ${isOutOfStock ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""}`}
        >
          {isAdded ? (
            <>
              <Check size={18} /> Added
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
