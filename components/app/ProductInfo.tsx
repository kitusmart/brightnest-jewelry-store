"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import {
  Truck,
  ShieldCheck,
  Lock,
  Sparkles,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartActions();

  const existingItem = useCartItem(product._id);
  const currentInCart = existingItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    if (currentInCart + quantity > product.stock) {
      toast.error(
        `Limit reached. You already have ${currentInCart} in your cart.`,
        {
          id: "stock-limit",
        },
      );
      return;
    }
    toast.dismiss();
    addItem(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.asset?.url || product.image,
        slug: product.slug.current || product.slug,
      },
      quantity,
    );
    setIsAdded(true);
    toast.success("Added to Cart", {
      id: "cart-action",
      action: { label: "View Cart", onClick: () => openCart() },
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const categoryName = product.category || "Collection";
  const categorySlug = categoryName.toLowerCase();

  return (
    /* CHANGED: Reduced gap-8 to gap-5 for a tighter layout */
    <div className="flex flex-col gap-4 md:gap-5 w-full lg:max-w-[520px] xl:max-w-[580px]">
      {/* Breadcrumb - Slightly smaller margin */}
      <nav className="hidden sm:flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-0">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">
          Home
        </Link>
        <ChevronRight size={10} />
        <Link
          href={`/?category=${categorySlug}`}
          className="hover:text-[#D4AF37] transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight size={10} />
        <span className="text-[#1B2A4E] truncate max-w-[150px]">
          {product.name}
        </span>
      </nav>

      <div className="flex flex-col gap-3">
        {/* CHANGED: lg:text-5xl -> lg:text-3xl to stop it from taking half the screen */}
        <h1 className="text-2xl md:text-3xl font-serif text-[#1B2A4E] tracking-tight uppercase leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* CHANGED: Reduced price size slightly */}
            <p className="text-xl md:text-2xl font-bold text-[#1B2A4E]">
              ${product.price?.toLocaleString()}
            </p>
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 line-through font-light italic">
                  ${product.compareAtPrice?.toLocaleString()}
                </span>
                <span className="bg-[#1B2A4E] text-[#D4AF37] text-[8px] font-black px-2 py-0.5 uppercase border border-[#D4AF37]/30">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>
          <div
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${isOutOfStock ? "bg-red-50 text-red-600 border-red-100" : "bg-white text-[#D4AF37] border-[#D4AF37]/20"}`}
          >
            {isOutOfStock ? "Archive" : `${product.stock} Available`}
          </div>
        </div>
      </div>

      {/* CHANGED: Reduced vertical padding from py-6 to py-4 */}
      <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4">
        <DetailItem label="Material" value={product.material} />
        <DetailItem label="Color" value={product.color} />
        <DetailItem label="Weight" value={product.weight} />
      </div>

      <div className="flex flex-col gap-4">
        {/* CHANGED: Reduced padding from py-4 to py-3 */}
        <div
          className={`flex items-center justify-between border border-gray-100 px-5 py-3 bg-[#fbf7ed]/20 ${isOutOfStock ? "opacity-30 pointer-events-none" : ""}`}
        >
          <span className="text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.3em]">
            Quantity
          </span>
          <div className="flex items-center gap-6">
            <QtyBtn
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              label="−"
            />
            <span className="font-bold text-[#1B2A4E] w-4 text-center">
              {quantity}
            </span>
            <QtyBtn
              onClick={() => {
                const maxAllowed = product.stock - currentInCart;
                if (quantity < maxAllowed) {
                  setQuantity((prev) => prev + 1);
                } else {
                  toast.error("Maximum reached", { id: "stock-limit" });
                }
              }}
              label="+"
            />
          </div>
        </div>

        {/* CHANGED: Reduced padding from py-5 to py-3.5 */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded || isOutOfStock}
          className={`w-full py-3.5 rounded-none font-bold uppercase tracking-[0.4em] text-[10px] transition-all duration-700 shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isAdded
                ? "bg-[#D4AF37] text-white"
                : "bg-[#1B2A4E] text-white hover:bg-[#D4AF37]"
          }`}
        >
          {isOutOfStock ? (
            "Request Restoration"
          ) : isAdded ? (
            <>
              ADDED TO CART <ShoppingCart size={14} />
            </>
          ) : (
            <>
              ADD TO CART <ShoppingCart size={14} />
            </>
          )}
        </button>

        {/* CHANGED: Reduced padding from py-4 to py-3 */}
        <button className="w-full bg-white border border-[#1B2A4E]/10 text-[#1B2A4E] py-3 rounded-none font-bold text-[9px] uppercase tracking-[0.3em] hover:bg-[#1B2A4E] hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
          <Sparkles size={14} className="text-[#D4AF37]" /> Ask AI for Style
          Guidance
        </button>

        {/* CHANGED: Reduced top margin */}
        <div className="grid grid-cols-3 gap-2 mt-1 pt-4 border-t border-gray-50">
          <TrustIcon Icon={Truck} label="Insured Delivery" />
          <TrustIcon Icon={ShieldCheck} label="Luster Guarantee" />
          <TrustIcon Icon={Lock} label="Encrypted Pay" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50">
        <h3 className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2">
          The Story
        </h3>
        <p className="text-[12px] text-[#1B2A4E] leading-loose font-light italic line-clamp-3">
          {product.description ||
            "A masterfully crafted piece designed to capture the essence of light and luxury."}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="text-[11px] md:text-[12px] font-medium text-[#1B2A4E] capitalize truncate">
        {value || "Pure Gold"}
      </span>
    </div>
  );
}

function QtyBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center text-[#1B2A4E] hover:text-[#D4AF37] text-lg transition-all"
    >
      {label}
    </button>
  );
}

function TrustIcon({ Icon, label }: { Icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon size={16} className="text-[#D4AF37] stroke-[1.5]" />
      <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
