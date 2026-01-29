"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Welcome to the Nest! Your luxury journey begins.");
      setEmail("");
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* 1. BRAND STORY */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-serif text-[#D4AF37] tracking-widest uppercase">
            Brightnest
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed font-light">
            Crafting timeless elegance for the modern woman. Our jewelry is designed to elevate your shine, every single day.
          </p>
          <div className="flex items-center gap-5">
            <Instagram size={18} className="text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <Facebook size={18} className="text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <Twitter size={18} className="text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* 2. COLLECTIONS */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em]">Collections</h3>
          <nav className="flex flex-col gap-3">
            {["Necklaces", "Earrings", "Rings", "Bangles"].map((item) => (
              <Link 
                key={item} 
                href={`/?category=${item.toLowerCase()}`}
                className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors font-light"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. CLIENT SERVICES */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em]">Client Services</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-500 font-light">
            <Link href="/orders" className="hover:text-[#D4AF37] transition-colors">My Orders</Link>
            <Link href="/policies" className="hover:text-[#D4AF37] transition-colors">Shipping & Returns</Link>
            <Link href="/policies" className="hover:text-[#D4AF37] transition-colors">Jewelry Care</Link>
            <a 
              href="https://wa.me/yournumber" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
            >
               <MessageCircle size={14} /> WhatsApp Support
            </a>
          </nav>
        </div>

        {/* 4. NEWSLETTER */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em]">Join the Nest</h3>
          <p className="text-sm text-gray-500 font-light">
            Subscribe for early access to new collections and styling tips.
          </p>
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-300"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-0 bottom-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:text-[#D4AF37] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Join"}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          © 2026 Brightnest Jewelry. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest">
          <Link href="/policies" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
          <Link href="/policies" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}