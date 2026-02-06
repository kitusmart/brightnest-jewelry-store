"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  User,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Instagram,
  Facebook,
} from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useWishlistStore } from "@/store/wishlist-store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 15,
    minutes: 45,
    seconds: 29,
  });

  const router = useRouter();
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  const toggleMenu = () => setIsOpen(!isOpen);

  // ANNOUNCEMENTS DATA
  const announcements = [
    "Free Shipping On Orders Above ₹500",
    "New Collection Drops Every Friday",
    "Join Our VIP Club for 10% Off",
  ];

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
  };
  const prevAnnouncement = () => {
    setAnnouncementIndex(
      (prev) => (prev - 1 + announcements.length) % announcements.length,
    );
  };

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* --- BAND 1: BLACK TIMER BAND --- */}
      <div className="bg-black text-[#D4AF37] text-[10px] md:text-xs font-medium tracking-wide py-2 flex flex-wrap items-center justify-center gap-1.5 md:gap-2 relative z-50 w-full overflow-hidden">
        <Sparkles size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
        <span className="text-white font-serif italic whitespace-nowrap">
          Sale Ends In:
        </span>
        <div className="flex items-center gap-1 font-bold tabular-nums text-[#D4AF37]">
          <span>{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[9px] font-light text-gray-400">h</span>
          <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[9px] font-light text-gray-400">m</span>
          <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[9px] font-light text-gray-400">s</span>
        </div>
      </div>

      {/* --- BAND 2: BLUE ANNOUNCEMENT BAND --- */}
      <div className="bg-[#1B2A4E] border-b border-[#1B2A4E] text-[#D4AF37] text-[10px] md:text-[11px] font-semibold uppercase tracking-widest py-2.5 flex items-center justify-center relative z-50 w-full overflow-hidden">
        <button
          onClick={prevAnnouncement}
          className="absolute left-2 md:left-[30%] text-[#D4AF37]/70 hover:text-white transition-colors p-2 z-10"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="animate-fade-in text-center px-2 max-w-[70%] whitespace-nowrap overflow-hidden text-ellipsis">
          {announcements[announcementIndex]}
        </span>

        <button
          onClick={nextAnnouncement}
          className="absolute right-2 md:right-[30%] text-[#D4AF37]/70 hover:text-white transition-colors p-2 z-10"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* --- 3. MAIN NAVBAR --- */}
      {/* FIXED: Removed transparency (bg-white/95) and added solid border to fix scrolling visibility */}
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 shadow-sm transition-all duration-300 w-full">
        {/* FIXED: Increased px-3 to px-5 so icons aren't cut off on mobile edges */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-3 md:pb-0">
          <div className="flex justify-between items-center relative gap-2 sm:gap-4 pt-2 md:pt-1">
            {/* Left Icons */}
            <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-[40px] mt-2 md:mt-10">
              <button
                onClick={toggleMenu}
                className="md:hidden text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="flex-shrink-0 flex justify-center items-center py-0">
              <Link href="/" className="block">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/full_logo.png"
                    alt="Elysia Luxe"
                    className="w-auto h-[40px] md:h-[105px] object-contain"
                    loading="eager"
                  />
                </div>
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1 min-w-[100px] md:min-w-0 mt-2 md:mt-10">
              <div className="relative hidden md:flex items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors group">
                      <User size={24} strokeWidth={1.5} />
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="scale-100 md:scale-110 opacity-90 hover:opacity-100 transition-opacity">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>

              <Link
                href="/wishlist"
                className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                <Heart size={24} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-[2px] border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => openCart()}
                className="relative text-[#1B2A4E] hover:text-[#D4AF37] transition-colors"
              >
                <ShoppingBag size={24} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-[2px] border-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center pb-5 pt-2">
            <div className="flex items-center gap-6 lg:gap-12 text-[11px] font-bold tracking-[0.2em] text-[#1B2A4E] uppercase">
              <NavLinks />
            </div>
          </div>
        </div>

        {/* --- SEARCH BAR SLIDE-DOWN --- */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
        >
          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto relative pb-4 px-4"
          >
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
              className="absolute right-4 top-2 text-[#1B2A4E] hover:text-[#D4AF37]"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* --- MOBILE MENU --- */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-6 flex flex-col justify-between z-50 h-[calc(100vh-140px)] overflow-y-auto">
            {/* Top Section */}
            <div className="flex flex-col items-center gap-8 w-full px-6">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-none border-b py-3 px-4 text-xs tracking-[0.2em] focus:border-[#D4AF37] outline-none bg-transparent uppercase"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  <Search size={16} />
                </button>
              </form>

              <div className="flex flex-col items-center gap-6 text-[13px] font-bold tracking-[0.2em] text-[#1B2A4E] uppercase w-full">
                <NavLinks onClick={() => setIsOpen(false)} />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col items-center gap-6 pb-10 w-full px-6 mt-8">
              <div className="w-20 h-[1px] bg-[#D4AF37]/30 mb-2"></div>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-[#1B2A4E] font-medium tracking-widest text-xs uppercase hover:text-[#D4AF37] transition-colors border border-[#1B2A4E]/20 px-8 py-3 w-full justify-center"
                  >
                    <User size={16} />
                    Login / Account
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col items-center gap-2">
                  <UserButton
                    afterSignOutUrl="/"
                    showName={true}
                    appearance={{
                      elements: {
                        userButtonBox: "flex-row-reverse",
                        userButtonOuterIdentifier:
                          "text-[#1B2A4E] font-serif uppercase tracking-widest",
                      },
                    }}
                  />
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                    My Account
                  </span>
                </div>
              </SignedIn>

              {/* Social Icons */}
              <div className="flex items-center gap-6 text-[#1B2A4E] mt-2">
                <a
                  href="#"
                  className="hover:text-[#D4AF37] transition-colors hover:scale-110 transform duration-300"
                >
                  <Instagram size={22} strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="hover:text-[#D4AF37] transition-colors hover:scale-110 transform duration-300"
                >
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
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
    if (href === "/") {
      e.preventDefault();
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
          className="relative group w-full text-center md:w-auto"
        >
          <span className="transition-colors duration-300 group-hover:text-[#D4AF37]">
            {link.name}
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full hidden md:block"></span>
        </Link>
      ))}
    </>
  );
}
