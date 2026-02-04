"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider"; // Added useCartItem
import { Truck, ShieldCheck, Lock, Sparkles, ChevronRight } from "lucide-react";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartActions();

  // 1. Get the current quantity of THIS item already in the basket
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
    // 2. BLOCK if the new quantity + existing basket quantity exceeds stock
    if (currentInCart + quantity > product.stock) {
      toast.error(
        `Limit reached. You already have ${currentInCart} in your basket.`,
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

    // 3. CLEAN NOTIFICATION: Removed description to prevent clumsy text overlap
    toast.success("Added to Basket", {
      id: "cart-action",
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const categoryName = product.category || "Collection";
  const categorySlug = categoryName.toLowerCase();

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
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

      <div className="flex flex-col gap-4 -mt-4">
        <h1 className="text-4xl font-serif text-[#1B2A4E] tracking-tight uppercase leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-[#1B2A4E]">
              ${product.price?.toLocaleString()}
            </p>
            {hasDiscount && (
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-300 line-through font-light italic">
                  ${product.compareAtPrice?.toLocaleString()}
                </span>
                <span className="bg-[#1B2A4E] text-[#D4AF37] text-[9px] font-black px-3 py-1 uppercase border border-[#D4AF37]/30">
                  {discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>
          <div
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${isOutOfStock ? "bg-red-50 text-red-600 border-red-100" : "bg-white text-[#D4AF37] border-[#D4AF37]/20"}`}
          >
            {isOutOfStock ? "Archive Piece" : `${product.stock} Available`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 border-y border-gray-100 py-8">
        <DetailItem label="Material" value={product.material} />
        <DetailItem label="Color" value={product.color} />
        <DetailItem label="Weight" value={product.weight} />
      </div>

      <div className="flex flex-col gap-5">
        <div
          className={`flex items-center justify-between border border-gray-100 px-6 py-4 bg-[#fbf7ed]/20 ${isOutOfStock ? "opacity-30 pointer-events-none" : ""}`}
        >
          <span className="text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.3em]">
            Quantity
          </span>
          <div className="flex items-center gap-8">
            <QtyBtn
              // Prevent quantity from going below 1
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              label="−"
            />
            <span className="font-bold text-[#1B2A4E] w-4 text-center">
              {quantity}
            </span>
            <QtyBtn
              onClick={() => {
                // Calculate how many more can actually be added [cite: 123-124]
                const maxAllowed = product.stock - currentInCart;
                // If we are already at the limit, don't let the number go up
                if (quantity < maxAllowed) {
                  setQuantity((prev) => prev + 1);
                } else {
                  toast.error("Maximum available stock reached", {
                    id: "stock-limit",
                  });
                }
              }}
              label="+"
            />
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdded || isOutOfStock}
          className={`w-full py-5 rounded-none font-bold uppercase tracking-[0.4em] text-[11px] transition-all duration-700 shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isAdded
                ? "bg-[#D4AF37] text-white"
                : "bg-[#1B2A4E] text-white hover:bg-[#D4AF37] hover:tracking-[0.5em]"
          }`}
        >
          {isOutOfStock
            ? "Request Restoration"
            : isAdded
              ? "Safe in Basket ✓"
              : "Add to Basket"}
        </button>

        <button className="w-full bg-white border border-[#1B2A4E]/10 text-[#1B2A4E] py-4 rounded-none font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#1B2A4E] hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
          <Sparkles size={14} className="text-[#D4AF37]" /> Ask AI for Style
          Guidance
        </button>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-8 border-t border-gray-50">
          <TrustIcon Icon={Truck} label="Insured Delivery" />
          <TrustIcon Icon={ShieldCheck} label="Luster Guarantee" />
          <TrustIcon Icon={Lock} label="Encrypted Pay" />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50">
        <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4">
          The Story
        </h3>
        <p className="text-[13px] text-[#1B2A4E] leading-loose font-light italic">
          {product.description ||
            "A masterfully crafted piece designed to capture the essence of light and luxury."}
        </p>
      </div>
    </div>
  );
}

// Sub-components as provided in your original code
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {label}
      </span>
      <span className="text-[13px] font-medium text-[#1B2A4E] capitalize">
        {value || "Pure Gold"}
      </span>
    </div>
  );
}

function QtyBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center text-[#1B2A4E] hover:text-[#D4AF37] text-xl transition-all"
    >
      {label}
    </button>
  );
}

function TrustIcon({ Icon, label }: { Icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Icon size={18} className="text-[#D4AF37] stroke-[1.5]" />
      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
