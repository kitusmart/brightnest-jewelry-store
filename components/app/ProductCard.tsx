"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Check } from "lucide-react";

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
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white overflow-hidden border border-transparent hover:border-zinc-100 transition-all duration-700">
      {/* 🖼️ THE GALLERY FRAME */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#FDFDFD]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
        />

        {/* ✨ LUXURY OVERLAY ON HOVER */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

        {/* 💎 SIGNATURE BADGE */}
        {product.badge && (
          <div className="absolute top-0 left-0">
            <div className="bg-black text-white text-[8px] font-bold tracking-[0.2em] px-4 py-2 uppercase">
              {product.badge}
            </div>
          </div>
        )}

        {/* 🛒 MINIMALIST QUICK ACTION */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white shadow-sm flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-black hover:text-white"
        >
          {isAdded ? <Check size={16} /> : <Plus size={18} strokeWidth={1.5} />}
        </button>
      </Link>

      {/* 📝 THE DESIGNER LABEL */}
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-2 group-hover:text-black transition-colors duration-500">
          {product.category?.title || "Essentials"}
        </h3>

        <Link href={`/products/${product.slug}`}>
          <h2 className="text-[13px] text-zinc-800 font-light tracking-tight leading-snug mb-3 max-w-[180px] line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[15px] font-serif italic text-zinc-900">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}
