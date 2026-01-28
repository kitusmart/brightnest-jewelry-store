"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Check, Plus } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const isOutOfStock = product.stock <= 0;
  const mainImage = product.image || "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
  const hoverImage = product.images?.[1]?.asset?.url || mainImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-1000">
      {/* 🖼️ THE CANVAS - Increased spacing and softer shadows */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full block overflow-hidden bg-[#F9F9F9]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
        />

        {/* 💎 FLOATING MINIMALIST BADGE */}
        <div className="absolute top-5 left-5 z-10">
          {product.badge && !isOutOfStock && (
            <div className="bg-white/90 backdrop-blur-sm text-black text-[7px] font-black px-4 py-2 uppercase tracking-[0.3em] border border-zinc-100 shadow-sm">
              {product.badge}
            </div>
          )}
        </div>

        {/* 🛒 ELEGANT QUICK ADD - Minimalist Plus Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdded || isOutOfStock}
          className="absolute bottom-5 right-5 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 border border-zinc-50 hover:bg-black hover:text-white"
        >
          {isAdded ? <Check size={18} strokeWidth={3} /> : <Plus size={20} strokeWidth={1} />}
        </button>
      </Link>

      {/* 📝 THE TYPOGRAPHY - Centered, light, and airy */}
      <div className="pt-8 pb-4 flex flex-col items-center text-center px-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[10px] md:text-[11px] font-medium text-zinc-400 uppercase tracking-[0.25em] mb-3 transition-colors group-hover:text-black leading-relaxed max-w-[200px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="h-[1px] w-8 bg-[#D4AF37]/30 mb-4 transition-all group-hover:w-16 group-hover:bg-[#D4AF37]" />

        <span className="text-[14px] font-light tracking-[0.1em] text-black">
          ${product.price?.toLocaleString("en-AU")}
        </span>
      </div>
    </div>
  );
}