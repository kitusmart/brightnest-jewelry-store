"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. MAIN LOGO ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center relative">
          {/* Left: Search & Mobile Menu */}
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-[#D4AF37]">
              <Menu size={24} />
            </button>
            <button className="hidden md:block text-[#D4AF37] hover:opacity-80 transition-opacity">
              <Search size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: LOGO */}
          <div className="flex-1 text-center">
            <Link
              href="/"
              className="flex flex-col items-center justify-center"
            >
              <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#D4AF37] font-normal">
                BRIGHTNEST
              </h1>
              <p className="text-[9px] text-[#D4AF37] tracking-[0.4em] uppercase mt-2 opacity-80">
                Elevate your Shine
              </p>
            </Link>
          </div>

          {/* Right: LOGIN & CART */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[#D4AF37] hover:opacity-80 transition-opacity">
                  <User size={22} strokeWidth={1.5} />
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="scale-75 opacity-90 hover:opacity-100 transition-opacity">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <Link
              href="/cart"
              className="relative text-[#D4AF37] hover:opacity-80 transition-opacity group"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />

              {/* 🟡 DYNAMIC GOLD BADGE */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS ROW */}
      <div className="hidden md:flex justify-center border-t border-[#fbf7ed] bg-white relative">
        <div className="flex items-center gap-10 text-[12px] font-medium tracking-[0.15em] text-[#D4AF37] py-4 uppercase">
          <Link
            href="/"
            className="hover:text-black transition-colors duration-300"
          >
            Home
          </Link>

          <Link
            href="/?category=necklaces"
            className="hover:text-black transition-colors duration-300"
          >
            Necklaces
          </Link>

          <Link
            href="/?category=earrings"
            className="hover:text-black transition-colors duration-300"
          >
            Earrings
          </Link>

          <Link
            href="/?category=rings"
            className="hover:text-black transition-colors duration-300"
          >
            Rings
          </Link>

          <Link
            href="/?category=bracelets"
            className="hover:text-black transition-colors duration-300"
          >
            Bangles
          </Link>

          <Link
            href="/?category=kada"
            className="hover:text-black transition-colors duration-300"
          >
            Kada
          </Link>

          <Link
            href="/?category=combos"
            className="hover:text-black transition-colors duration-300"
          >
            Combos
          </Link>
        </div>
      </div>
    </nav>
  );
}
