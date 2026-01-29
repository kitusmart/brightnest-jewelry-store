"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;
  const mainImage =
    product.image || "https://placehold.co/600x800/f8f8f8/999?text=Collection";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    setIsAdded(true);
    toast.success("Added to your collection");
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-1000 ease-in-out">
      {/* 🖼️ IMAGE CANVAS - Clean edges, slow zoom */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#F9F9F9] rounded-[2px]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-110"
        />

        {/* 💎 MINIMALIST BRAND BADGE */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[8px] font-bold tracking-[0.25em] uppercase text-black border border-zinc-100 shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* 🛒 FLOATING PLUS ACTION */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className="absolute bottom-5 right-5 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-zinc-100 hover:bg-black hover:text-white"
        >
          {isAdded ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Plus size={20} strokeWidth={1} />
          )}
        </button>
      </Link>

      {/* 📝 EDITORIAL TYPOGRAPHY */}
      <div className="pt-7 pb-4 flex flex-col items-center text-center px-2">
        {/* Sub-label / Category */}
        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium mb-2.5">
          {product.material || "Fine Jewelry"}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h2 className="text-[13px] text-zinc-900 font-light tracking-tight leading-relaxed mb-3 hover:text-zinc-500 transition-colors duration-300 px-4">
            {product.name}
          </h2>
        </Link>

        {/* Elegant Price using Serif font */}
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-serif italic text-black tracking-tight">
            ${product.price?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
