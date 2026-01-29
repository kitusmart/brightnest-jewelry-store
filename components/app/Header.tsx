"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useTotalItems } from "@/lib/store/cart-store-provider"; // <--- Importing the REAL hook
import { useEffect, useState } from "react";

export function Header() {
  // 1. Get the total items directly from your store
  const itemCount = useTotalItems();

  // 2. Fix "Hydration Error" (Server sees 0, Client sees real number)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full">
      {/* 1. The Announcement Bar */}
      <div className="w-full bg-black text-white text-xs font-medium py-2 text-center tracking-wide">
        FREE SHIPPING TO AUSTRALIA ON ORDERS OVER $50 ✈️
      </div>

      {/* 2. The Main Header */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
              <Menu className="w-6 h-6 text-black" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full hidden lg:block">
              <Search className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Center: The Logo */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-black uppercase"
            >
              Aurelia Jewels
            </Link>
          </div>

          {/* Right: User & Cart */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
              <User className="w-5 h-5 text-black" />
            </button>

            <Link
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-full relative group"
            >
              <ShoppingBag className="w-5 h-5 text-black group-hover:text-gray-600 transition-colors" />

              {/* Smart Cart Counter Bubble */}
              {mounted && itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
