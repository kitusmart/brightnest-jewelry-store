"use client";

import { useWishlistStore } from "@/store/wishlist-store";
import { ProductCard } from "@/components/app/ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch between server and local storage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
          Your Private Vault
        </span>
        <h1 className="text-4xl font-serif text-[#1B2A4E] uppercase tracking-tight">
          The Wishlist
        </h1>
        <div className="mt-6 h-px w-16 bg-[#D4AF37] mx-auto"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {items.map((item) => (
              // Passing item as 'product' so ProductCard stays reusable
              <ProductCard key={item.productId} product={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20">
            <p className="text-gray-400 font-light italic mb-8">
              Your vault is currently empty.
            </p>
            <Link
              href="/"
              className="text-[#1B2A4E] text-[10px] font-bold uppercase tracking-[0.3em] border-b border-[#D4AF37] pb-2 hover:text-[#D4AF37] transition-all"
            >
              Discover Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
