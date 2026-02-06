"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";

export function ProductCard({ product }: { product: any }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCartActions();

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

    if (isLimitReached || isOutOfStock) {
      // CHANGED TEXT: basket -> cart
      toast.error(
        `All ${product.stock} available items are already in your cart.`,
        { id: "cart-toggle" },
      );
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
    // CHANGED TEXT: Added to Basket -> Added to Cart
    toast.success("Added to Cart", { id: "cart-toggle" });
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
    <div className="group relative flex flex-col w-full flex-shrink-0 bg-white transition-all duration-500 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
      <Link
        href={productUrl}
        className="relative block overflow-hidden bg-[#F9F9F9]"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-auto aspect-[4/5] object-cover transition-opacity duration-700 group-hover:opacity-0"
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="absolute inset-0 w-full h-auto aspect-[4/5] object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100"
        />

        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-30 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
        >
          <Heart
            size={14}
            strokeWidth={isLoved ? 0 : 2}
            className={`transition-colors duration-300 ${isLoved ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-400"}`}
          />
        </button>

        {product.badge && !isOutOfStock && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
            <div className="bg-white px-2 py-0.5 md:px-2.5 md:py-1 text-[7px] md:text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest rounded-full shadow-sm">
              {product.badge}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-[#1B2A4E]/90 backdrop-blur-md py-2 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <span className="text-white text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em]">
            View Details
          </span>
        </div>
      </Link>

      <div className="pt-2 pb-3 md:pt-3 md:pb-4 flex flex-col items-center text-center px-2 md:px-3 flex-grow">
        <Link href={productUrl} className="w-full">
          <h3 className="text-[#1B2A4E] text-[11px] md:text-[12px] font-bold leading-tight mb-1 line-clamp-1 uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
          <span className="text-[12px] md:text-[14px] font-bold text-[#1B2A4E]">
            ${product.price?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] md:text-[11px] text-gray-400 line-through font-normal">
              ${product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock || isLimitReached}
          className={`w-full py-2 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 shadow-sm flex items-center justify-center gap-2 ${
            isAdded
              ? "bg-[#D4AF37] text-white"
              : isOutOfStock || isLimitReached
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#1B2A4E] text-white hover:bg-[#D4AF37] hover:text-white"
          }`}
        >
          {isAdded ? (
            <>
              IN CART <ShoppingCart size={12} />
            </>
          ) : isOutOfStock ? (
            "SOLD OUT"
          ) : isLimitReached ? (
            "LIMIT REACHED"
          ) : (
            <>
              ADD TO CART <ShoppingCart size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
