"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import {
  ShoppingBag,
  Search,
  Menu,
  User,
  X,
  Heart,
  Gem,
  Zap,
} from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useWishlistStore } from "@/store/wishlist-store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();

  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* 1. PRESIDENTIAL TOP BAR */}
      <div className="bg-[#1B2A4E] text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] py-2.5 text-center hidden md:block">
        Complimentary Shipping on all Orders Over $200
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6">
          <div className="flex justify-between items-center relative">
            {/* Left: Search & Mobile Menu */}
            <div className="flex items-center gap-6 flex-1">
              <button
                onClick={toggleMenu}
                className="md:hidden text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex items-center gap-2 text-[#1B2A4E] hover:text-[#D4AF37] transition-colors group"
              >
                {isSearchOpen ? <X size={24} /> : <Search size={24} />}
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0">
                  {isSearchOpen ? "Close" : "Search"}
                </span>
              </button>
            </div>

            {/* Center: LOGO AREA */}
            <div className="flex-1 flex justify-center">
              {/* Added manual scroll for logo home click */}
              <Link
                href="/"
                className="flex items-center gap-4 group"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setIsOpen(false);
                }}
              >
                <Gem
                  size={44}
                  strokeWidth={1.2}
                  className="text-[#1B2A4E] group-hover:rotate-12 transition-transform duration-500"
                />
                <div className="flex flex-col items-start -mt-1">
                  <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide text-[#D4AF37] leading-none">
                    BRIGHTNEST
                  </h1>
                  <span className="text-[9px] text-[#1B2A4E] tracking-[0.4em] uppercase w-full text-center mt-1 font-bold">
                    Jewelry Store
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: ICONS */}
            <div className="flex items-center justify-end gap-6 flex-1">
              <div className="relative">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors group">
                      <User size={28} strokeWidth={1.5} />
                      <Zap
                        size={16}
                        className="absolute -bottom-1 -right-1 text-[#F59E0B] fill-[#F59E0B] stroke-white stroke-[2px]"
                      />
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="scale-110 opacity-90 hover:opacity-100 transition-opacity">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>

              <Link
                href="/wishlist"
                className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                <Heart size={28} strokeWidth={1.5} />
                {wishlistCount >= 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => openCart()}
                className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                <ShoppingBag size={28} strokeWidth={1.5} />
                {totalItems >= 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* --- SEARCH BAR SLIDE-DOWN --- */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-h-20 opacity-100 mt-6" : "max-h-0 opacity-0"}`}
          >
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search our collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-b border-[#1B2A4E] py-2 pl-2 pr-10 text-center text-[#1B2A4E] placeholder:text-gray-400 focus:outline-none bg-transparent font-serif text-lg"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 top-2 text-[#1B2A4E] hover:text-[#D4AF37]"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* 3. NAVIGATION */}
        <div className="hidden md:flex justify-center border-t border-[#D4AF37]/30 py-4">
          <div className="flex items-center gap-12 text-[11px] font-bold tracking-[0.2em] text-[#1B2A4E] uppercase">
            <NavLinks />
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-8 flex flex-col items-center gap-8 z-50 animate-in slide-in-from-top-5 duration-300 h-screen">
            <form onSubmit={handleSearch} className="w-3/4 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-none border-b py-2 px-4 text-xs tracking-widest focus:border-[#D4AF37] outline-none bg-transparent"
              />
            </form>
            <div className="flex flex-col items-center gap-6 text-[13px] font-bold tracking-[0.2em] text-[#1B2A4E] uppercase">
              <NavLinks onClick={() => setIsOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter(); // Added router for cleaner navigation

  const links = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/about" },
    { name: "Necklaces", href: "/?category=necklaces" },
    { name: "Earrings", href: "/?category=earrings" },
    { name: "Rings", href: "/?category=rings" },
    { name: "Bangles", href: "/?category=bangles" },
    { name: "Kada", href: "/?category=kada" },
    { name: "Sets", href: "/?category=combos" },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Check if we are clicking "Home"
    if (href === "/") {
      e.preventDefault();

      // 1. Reset URL to just "/" (clears ?category=...)
      router.push("/");

      // 2. Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 3. Refresh data to ensure all products show and "ghosts" disappear
      router.refresh();
    }

    if (onClick) onClick();
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          scroll={false}
          className="relative group"
        >
          <span className="transition-colors duration-300 group-hover:text-[#D4AF37]">
            {link.name}
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
        </Link>
      ))}
    </>
  );
}
