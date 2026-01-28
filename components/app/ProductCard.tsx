"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Check, XCircle } from "lucide-react";
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

    const itemInCart = cartItems.find((item: any) => item.product._id === product._id);
    if (itemInCart && itemInCart.quantity >= product.stock) {
      toast.error(`Only ${product.stock} pieces available`);
      return;
    }

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-700">
      {/* 🖼️ IMAGE SECTION - Portrait 4:5 Aspect Ratio */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full block overflow-hidden rounded-sm bg-[#fcfcfc]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        />

        {/* 💎 MINIMALIST BADGES */}
        <div className="absolute top-4 left-4 z-10">
          {product.badge && !isOutOfStock && (
            <div className="bg-white/80 backdrop-blur-md text-[#D4AF37] text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em] shadow-sm border border-[#fbf7ed] flex items-center gap-2">
              <span className="h-1 w-1 bg-[#D4AF37] rounded-full animate-pulse" />
              {product.badge}
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-zinc-100/90 backdrop-blur-md text-zinc-500 text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.2em]">
              Sold Out
            </div>
          )}
        </div>

        {/* 🛒 FLOATING QUICK ADD - Appears on Hover */}
        <div className="absolute inset-x-0 bottom-6 px-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button
            onClick={handleQuickAdd}
            disabled={isAdded || isOutOfStock}
            className={`w-full py-4 text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
              isAdded 
                ? "bg-green-600 text-white" 
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          >
            {isAdded ? (
              <><Check size={14} strokeWidth={3} /> In Bag</>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <><ShoppingBag size={14} strokeWidth={1.5} /> Add to Bag</>
            )}
          </button>
        </div>
      </Link>

      {/* 📝 CONTENT SECTION - Centered & Refined */}
      <div className="pt-6 pb-2 flex flex-col items-center text-center space-y-2">
        <Link href={`/products/${product.slug}`} className="max-w-[90%]">
          <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.15em] leading-relaxed transition-colors group-hover:text-black">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-serif tracking-widest text-zinc-900 mt-1">
            ${product.price?.toLocaleString("en-AU")}
          </span>
          {/* Subtle "Offer" price text removed for cleaner look, added back if needed */}
        </div>
      </div>
    </div>
  );
}