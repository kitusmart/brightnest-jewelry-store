"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, MessageCircle, Mail } from "lucide-react";
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
    <footer className="bg-[#1B2A4E] text-white pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* 1. BRAND STORY */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-serif text-[#D4AF37] tracking-[0.3em] uppercase">
            Brightnest
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-light italic">
            Crafting timeless elegance for the modern woman. Our jewelry is designed to elevate your shine, every single day.
          </p>
          <div className="flex items-center gap-5">
            <Instagram size={18} className="text-[#D4AF37] hover:text-white cursor-pointer transition-colors" />
            <Facebook size={18} className="text-[#D4AF37] hover:text-white cursor-pointer transition-colors" />
            <Twitter size={18} className="text-[#D4AF37] hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* 2. COLLECTIONS */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Collections</h3>
          <nav className="flex flex-col gap-3">
            {["Necklaces", "Earrings", "Rings", "Bangles", "Kada", "Combos"].map((item) => (
              <Link 
                key={item} 
                href={`/?category=${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors font-light"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. CLIENT SERVICES */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Client Services</h3>
          <nav className="flex flex-col gap-3 text-sm text-gray-400 font-light">
            <Link href="/orders" className="hover:text-[#D4AF37] transition-colors font-light">My Orders</Link>
            <Link href="/policies" className="hover:text-[#D4AF37] transition-colors font-light">Shipping & Returns</Link>
            <Link href="/care-guide" className="hover:text-[#D4AF37] transition-colors font-light">Jewelry Care</Link>
            <a 
              href="https://wa.me/yournumber" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-light"
            >
               <MessageCircle size={14} /> WhatsApp Support
            </a>
          </nav>
        </div>

        {/* 4. NEWSLETTER */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Join the Nest</h3>
          <p className="text-sm text-gray-400 font-light">
            Subscribe for exclusive access to new launches and private sales.
          </p>
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 py-3 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-gray-600"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-0 bottom-3 text-[#D4AF37] hover:text-white transition-all disabled:opacity-50"
            >
              {isSubmitting ? "..." : <Mail size={18} />}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
        <p className="text-[10px] uppercase tracking-[0.2em]">
          © 2026 Brightnest Jewelry. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em]">
          <Link href="/policies" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/policies" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}