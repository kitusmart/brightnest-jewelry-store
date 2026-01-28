"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, Menu, User, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 1. MAIN LOGO ROW */}
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
                {/* This is the Logout/Profile button */}
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <Link
              href="/cart"
              className="relative text-[#D4AF37] hover:opacity-80 transition-opacity group"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />

              {/* DYNAMIC GOLD BADGE */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. DESKTOP NAVIGATION LINKS */}
      <div className="hidden md:flex justify-center border-t border-[#fbf7ed] bg-white relative">
        <div className="flex items-center gap-10 text-[12px] font-medium tracking-[0.15em] text-[#D4AF37] py-4 uppercase">
          <NavLinks />
        </div>
      </div>

      {/* 3. MOBILE MENU DROPDOWN */}
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

// Helper Component for Links
function NavLinks({ onClick }: { onClick?: () => void }) {
  const links = [
    { name: "Home", href: "/" },
    { name: "Necklaces", href: "/?category=necklaces" },
    { name: "Earrings", href: "/?category=earrings" },
    { name: "Rings", href: "/?category=rings" },
    { name: "Bangles", href: "/?category=bangles" },
    { name: "Kada", href: "/?category=kada" },
    { name: "Combos", href: "/?category=combos" },
    // NEW LINK ADDED HERE
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