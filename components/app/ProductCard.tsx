"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider"; // 1. Added useCartItem
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";

export function ProductCard({ product }: { product: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCartActions();

  // 2. Track current quantity in basket for this specific product
  const currentId = product._id || product.productId;
  const existingItem = useCartItem(currentId);
  const currentInCart = existingItem?.quantity || 0;

  const items = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );

  const isLoved = items.some((item) => item.productId === currentId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const productSlug = product.slug?.current || product.slug;
  const productUrl = `/products/${productSlug}`;

  // 3. Define stock logic
  const isOutOfStock = product.stock <= 0;
  const isLimitReached = currentInCart >= product.stock;

  const hasDiscount = product.compareAtPrice > product.price;

  const mainImage =
    product.images?.[0]?.asset?.url ||
    product.image ||
    "https://placehold.co/500x500/f3f4f6/9ca3af?text=No+Image";
  const hoverImage =
    product.images?.[1]?.asset?.url || product.hoverImage || mainImage;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    if (isLoved) {
      removeFromWishlist(currentId);
      toast.info("Removed from Wishlist", { id: "wishlist-toggle" });
    } else {
      addToWishlist({
        productId: currentId,
        name: product.name,
        price: product.price,
        image: mainImage,
        hoverImage: hoverImage || mainImage,
        slug: productSlug,
      });
      toast.success("Added to Wishlist", { id: "wishlist-toggle" });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 4. Hard block if the user tries to add more than available stock
    if (isOutOfStock || isLimitReached) {
      toast.error(`Stock limit reached (${product.stock} available)`, {
        id: "cart-toggle",
      });
      return;
    }

    addItem({
      productId: currentId,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: productSlug,
    });

    setIsAdded(true);
    toast.dismiss();
    toast.success("Added to Basket", { id: "cart-toggle" });
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col animate-pulse">
        <div className="aspect-[4/5] bg-gray-50 rounded-2xl" />
        <div className="mt-4 h-4 w-3/4 bg-gray-50 mx-auto" />
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-500 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
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
          className="absolute inset-0 w-full h-auto aspect-[4/5] object-cover opacity-0 transition-all duration-1000 group-hover:opacity-100 scale-105 group-hover:scale-100"
        />

        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-30 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            size={14}
            strokeWidth={isLoved ? 0 : 2}
            className={`transition-colors duration-300 ${
              isLoved ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-400"
            }`}
          />
        </button>

        {product.badge && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-white px-2.5 py-1 text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest rounded-full shadow-sm">
              {product.badge}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-[#1B2A4E]/90 backdrop-blur-md py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <span className="text-white text-[9px] font-bold uppercase tracking-[0.3em]">
            View Details
          </span>
        </div>
      </Link>

      <div className="pt-3 pb-4 flex flex-col items-center text-center px-3 flex-grow">
        <Link href={productUrl} className="w-full">
          <h3 className="text-[#1B2A4E] text-[12px] font-bold leading-tight mb-1 line-clamp-1 uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#1B2A4E]">
            ${product.price?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through font-normal">
              ${product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          // 5. Disable the button visually if out of stock or limit reached
          disabled={isOutOfStock || isLimitReached}
          className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow-md ${
            isAdded
              ? "bg-[#D4AF37] text-white border border-[#D4AF37]"
              : isOutOfStock || isLimitReached
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#1B2A4E] text-white border border-[#1B2A4E] hover:bg-[#2a3f6e]"
          }`}
        >
          {isAdded
            ? "In Cart"
            : isOutOfStock
              ? "Sold Out"
              : isLimitReached
                ? "Limit Reached"
                : "Add to Basket"}
        </button>
      </div>
    </div>
  );
}
