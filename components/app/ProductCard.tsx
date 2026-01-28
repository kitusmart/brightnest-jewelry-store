"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Check, XCircle } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: any }) {
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const itemInCart = cartItems.find(
      (item: any) => item.product._id === product._id,
    );
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (quantityInCart >= product.stock) {
      toast.error(`Only ${product.stock} pieces available`);
      return;
    }

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const mainImage =
    product.image || "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
  const hoverImage = product.images?.[1]?.asset?.url || mainImage;

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl ${isOutOfStock ? "opacity-75" : ""}`}
    >
      {/* 🖼️ IMAGE SECTION */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full block overflow-hidden bg-gray-50"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110"
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
        />

        {/* 💎 LUXURY DYNAMIC BADGES */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isOutOfStock ? (
            <div className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-[0.2em] uppercase shadow-lg">
              Sold Out
            </div>
          ) : (
            <>
              {/* This shows the badge text you type in Sanity (e.g., "Tarnish Free" or "18k Gold") */}
              {product.badge && (
                <div className="bg-white/90 backdrop-blur-md text-[#D4AF37] text-[9px] font-black px-3 py-1.5 rounded-full tracking-[0.2em] uppercase shadow-sm border border-[#fbf7ed] flex items-center gap-1.5">
                   <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]"></span>
                  </span>
                  {product.badge}
                </div>
              )}
              
              {/* Fallback "Offer" badge only if no custom badge is set */}
              {!product.badge && (
                <div className="bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-[0.2em] uppercase shadow-lg">
                  Offer
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      {/* 📝 CONTENT SECTION */}
      <div className="p-5 flex flex-col gap-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[14px] font-bold text-gray-900 truncate tracking-tight group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 line-through font-medium">
            ${(product.price * 1.5).toLocaleString("en-AU")}
          </span>
          <span className="text-lg font-black text-gray-900">
            ${product.price?.toLocaleString("en-AU")}
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={isAdded || isOutOfStock}
          className={`mt-3 w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : isAdded
                ? "bg-green-600 text-white"
                : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
          }`}
        >
          {isOutOfStock ? (
            <>
              <XCircle size={14} /> Sold Out
            </>
          ) : isAdded ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            <>
              <span>Add to Cart</span>
              <ShoppingCart size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}