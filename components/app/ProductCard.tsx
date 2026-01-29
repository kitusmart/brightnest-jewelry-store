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
  const mainImage =
    product.image || "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";

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
    <div className="group relative flex flex-col bg-white border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* 🖼️ IMAGE SECTION */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-white"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 🔍 QUICK VIEW OVERLAY - Appears on Hover */}
        <div className="absolute inset-x-0 bottom-0 bg-white/90 py-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-t border-gray-100">
          <span className="text-gray-600 text-sm font-light">Quick View</span>
        </div>

        {/* 🏷️ BADGE (18K GOLD) */}
        {product.badge && !isOutOfStock && (
          <div className="absolute top-3 left-3">
            <div className="bg-white/95 px-3 py-1 text-[10px] font-bold tracking-widest text-black shadow-sm border border-gray-100 uppercase">
              {product.badge}
            </div>
          </div>
        )}
      </Link>

      {/* 📝 CONTENT SECTION */}
      <div className="p-4 flex flex-col items-start space-y-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-gray-800 text-[15px] font-normal leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
        </div>

        {/* 🛒 ADD TO CART BUTTON - Permanent & Bold */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full mt-2 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-[#0A1435] text-white hover:bg-[#1a2b5a]"
          } ${isOutOfStock ? "bg-gray-200 cursor-not-allowed text-gray-500" : ""}`}
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
