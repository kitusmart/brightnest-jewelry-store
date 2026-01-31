"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartActions } from "@/lib/store/cart-store-provider";
import { Check, Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";

export function ProductCard({ product }: { product: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem, openCart } = useCartActions();

  const items = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );

  const currentId = product._id || product.productId;
  const isLoved = items.some((item) => item.productId === currentId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const productSlug = product.slug?.current || product.slug;
  const productUrl = `/products/${productSlug}`;
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice > product.price;

  const mainImage =
    product.images?.[0]?.asset?.url ||
    product.image ||
    "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
  const hoverImage =
    product.images?.[1]?.asset?.url || product.hoverImage || mainImage;

  // ⭐ FIXED TOGGLE LOGIC: Strict dismissal and stop propagation
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Keep the dismissal to prevent stacking
    toast.dismiss();

    if (isLoved) {
      removeFromWishlist(currentId);
      // ⭐ Changed to "Wishlist" as requested
      toast.info("Removed from Wishlist", { id: "wishlist-toggle" });
    } else {
      addToWishlist({
        productId: currentId,
        name: product.name,
        price: product.price,
        image: mainImage,
        hoverImage: hoverImage,
        slug: productSlug,
      });
      // ⭐ Changed to "Added to Wishlist" as requested
      toast.success("Added to Wishlist", { id: "wishlist-toggle" });
    }
  };

  // ⭐ UPDATED CART NOTIFICATIONS
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      productId: currentId,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: productSlug,
    });

    setIsAdded(true);
    openCart();

    toast.dismiss(); // Clean UI
    toast.success("Added to Basket", { id: "cart-toggle" }); // Changed to Basket

    setTimeout(() => setIsAdded(false), 2000);
  };
  if (!isMounted) {
    return (
      <div className="flex flex-col animate-pulse">
        <div className="aspect-[4/5] bg-gray-50 rounded-sm" />
        <div className="mt-4 h-4 w-3/4 bg-gray-50 mx-auto" />
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-500 border border-transparent hover:shadow-2xl hover:shadow-gray-100">
      <Link
        href={productUrl}
        className="relative block overflow-hidden bg-[#F9F9F9]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-[4/5] object-cover transition-opacity duration-1000 group-hover:opacity-0"
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-auto aspect-[4/5] object-cover opacity-0 transition-all duration-1000 group-hover:opacity-100 scale-110 group-hover:scale-100"
        />

        {/* Wishlist Button - type="button" added to prevent form/link triggers */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-30 p-2.5 bg-white rounded-full shadow-md transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            size={16}
            strokeWidth={isLoved ? 0 : 2}
            className={`transition-colors duration-300 ${
              isLoved ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-400"
            }`}
          />
        </button>

        {product.badge && !isOutOfStock && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[8px] font-black text-[#1B2A4E] border border-gray-100 uppercase tracking-[0.2em]">
              {product.badge}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-[#1B2A4E]/90 backdrop-blur-md py-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <span className="text-white text-[9px] font-bold uppercase tracking-[0.3em]">
            Discover Piece
          </span>
        </div>
      </Link>

      <div className="pt-6 pb-4 flex flex-col items-center text-center px-4">
        <Link href={productUrl} className="w-full">
          <h3 className="text-[#1B2A4E] text-[12px] font-medium leading-relaxed mb-2 line-clamp-2 min-h-[36px] uppercase tracking-[0.1em] group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

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

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-3.5 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-700 border ${
            isAdded
              ? "bg-[#D4AF37] border-[#D4AF37] text-white"
              : "bg-transparent border-[#1B2A4E]/10 text-[#1B2A4E] hover:bg-[#1B2A4E] hover:border-[#1B2A4E] hover:text-white"
          } ${isOutOfStock ? "bg-gray-50 border-gray-100 cursor-not-allowed text-gray-300" : ""}`}
        >
          {isAdded
            ? "Added to Nest"
            : isOutOfStock
              ? "Archive Only"
              : "Purchase Now"}
        </button>
      </div>
    </div>
  );
}
