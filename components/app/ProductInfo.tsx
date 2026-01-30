"use client";

import { useState } from "react";
import Link from "next/link";
// FIXED: Switched to the luxury store provider hooks
import { useCartActions } from "@/lib/store/cart-store-provider";
import { Truck, ShieldCheck, Lock, Sparkles, ChevronRight } from "lucide-react";

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // FIXED: Accessing actions from the correct luxury store
  const { addItem, openCart } = useCartActions();

  // Stock & Discount Logic
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) return;

    // FIXED: Mapping data explicitly to the new CartItem type including slug
    addItem(
      {
        productId: product._id, // Use the unique Sanity ID
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.asset?.url || product.image,
        slug: product.slug.current || product.slug, // FIXED: Ensure slug is passed to prevent 404s
      },
      quantity,
    );

    setIsAdded(true);

    // LUXURY FLOW: Open the Midnight Blue drawer immediately
    openCart();

    setTimeout(() => setIsAdded(false), 2000);
  };

  const categoryName = product.category || "Collection";
  const categorySlug = categoryName.toLowerCase();

  return (
    <div className="flex flex-col gap-8">
      {/* BREADCRUMBS */}
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

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col gap-4 -mt-4">
        <h1 className="text-4xl font-serif text-[#1B2A4E] tracking-tight uppercase leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-[#1B2A4E]">
                ${product.price?.toLocaleString()}
              </p>
              {hasDiscount && (
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-300 line-through font-light italic">
                    ${product.compareAtPrice?.toLocaleString()}
                  </span>
                  <span className="bg-[#1B2A4E] text-[#D4AF37] text-[9px] font-black px-3 py-1 uppercase tracking-widest border border-[#D4AF37]/30">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              isOutOfStock
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-white text-[#D4AF37] border-[#D4AF37]/20"
            }`}
          >
            {isOutOfStock ? "Archive Piece" : `${product.stock} Available`}
          </div>
        </div>
      </div>

      {/* 2. JEWELRY DETAILS GRID */}
      <div className="grid grid-cols-3 gap-8 border-y border-gray-100 py-8">
        <DetailItem label="Material" value={product.material} />
        <DetailItem label="Color" value={product.color} />
        <DetailItem label="Weight" value={product.weight} />
      </div>

      {/* 3. ACTIONS SECTION */}
      <div className="flex flex-col gap-5">
        <div
          className={`flex items-center justify-between border border-gray-100 px-6 py-4 bg-[#fbf7ed]/20 ${isOutOfStock ? "opacity-30 pointer-events-none" : ""}`}
        >
          <span className="text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.3em]">
            Quantity
          </span>
          <div className="flex items-center gap-8">
            <QtyBtn
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              label="−"
            />
            <span className="font-bold text-[#1B2A4E] w-4 text-center">
              {quantity}
            </span>
            <QtyBtn
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              label="+"
            />
          </div>
        </div>

        {/* PRIMARY BUTTON: Midnight Blue & Gold */}
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
              ? "Safe in Nest ✓"
              : "Add to Basket"}
        </button>

        <button className="w-full bg-white border border-[#1B2A4E]/10 text-[#1B2A4E] py-4 rounded-none font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#1B2A4E] hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
          <Sparkles size={14} className="text-[#D4AF37]" /> Ask AI for Style
          Guidance
        </button>

        {/* TRUST BADGES */}
        <div className="grid grid-cols-3 gap-6 mt-6 pt-8 border-t border-gray-50">
          <TrustIcon Icon={Truck} label="Insured Delivery" />
          <TrustIcon Icon={ShieldCheck} label="Luster Guarantee" />
          <TrustIcon Icon={Lock} label="Encrypted Pay" />
        </div>
      </div>

      {/* 4. DESCRIPTION */}
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

// Sub-components for cleaner Luxury Code
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
