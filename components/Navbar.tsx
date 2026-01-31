"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, Menu, User, X, Heart } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";

// ⭐ STEP 3: Import your new wishlist store from the root folder
import { useWishlistStore } from "@/store/wishlist-store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();

  // ⭐ STEP 3: Connect to the real wishlist count
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center relative">
          {/* Left: Search & Mobile Menu */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={toggleMenu}
              className="md:hidden text-[#D4AF37] hover:opacity-80 transition-opacity"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
              onClick={() => setIsOpen(false)}
            >
              <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#D4AF37] font-normal">
                BRIGHTNEST
              </h1>
              <p className="text-[9px] text-[#D4AF37] tracking-[0.4em] uppercase mt-2 opacity-80">
                Elevate your Shine
              </p>
            </Link>
          </div>

          {/* Right: LOGIN, WISHLIST & CART */}
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

            {/* WISHLIST ICON with real count badge */}
            <Link
              href="/wishlist"
              className="relative text-[#D4AF37] hover:opacity-80 transition-opacity p-2"
            >
              <Heart size={22} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-in zoom-in duration-300">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART ICON */}
            <button
              onClick={() => openCart()}
              className="relative text-[#D4AF37] hover:opacity-80 transition-opacity group p-2"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden md:flex justify-center border-t border-[#fbf7ed] bg-white relative">
        <div className="flex items-center gap-10 text-[12px] font-medium tracking-[0.15em] text-[#D4AF37] py-4 uppercase">
          <NavLinks />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-6 flex flex-col items-center gap-6 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col items-center gap-6 text-[14px] font-medium tracking-[0.15em] text-[#D4AF37] uppercase">
            <NavLinks onClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const links = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/about" },
    { name: "Necklaces", href: "/?category=necklaces" },
    { name: "Earrings", href: "/?category=earrings" },
    { name: "Rings", href: "/?category=rings" },
    { name: "Bangles", href: "/?category=bangles" },
    { name: "Kada", href: "/?category=kada" },
    { name: "Combos", href: "/?category=combos" },
    { name: "My Orders", href: "/orders" },
    { name: "Policies", href: "/policies" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={onClick}
          className="hover:text-black transition-colors duration-300"
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
