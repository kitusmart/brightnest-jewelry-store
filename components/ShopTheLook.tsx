"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const LOOKS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
    title: "Evening Radiance",
    items: "Gold Evil Eye + Diamond Studs",
    link: "/?category=combos"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop", 
    title: "Minimalist Aura",
    items: "18K Gold Bangle",
    link: "/?category=bangles"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2036&auto=format&fit=crop",
    title: "Bridal Suite",
    items: "Eternal Ring Collection",
    link: "/?category=rings"
  }
];

export default function ShopTheLook() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase">Curated Styles</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1B2A4E] mt-4 leading-tight">SHOP THE LOOK</h2>
            <p className="text-gray-400 mt-4 font-light italic text-sm md:text-base">
              Discover how our master artisans layer brilliance for every occasion.
            </p>
          </div>
          {/* FIXED: Link changed from /products to / to avoid 404 */}
          <Link href="/" className="text-[#1B2A4E] text-[11px] font-bold uppercase tracking-[0.2em] border-b border-[#D4AF37] pb-2 hover:text-[#D4AF37] transition-all">
            View All Styles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
          {/* Main Large Feature */}
          <div className="md:col-span-7 relative group overflow-hidden rounded-sm bg-[#fbf7ed]">
            <img 
              src={LOOKS[0].image} 
              alt={LOOKS[0].title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-serif mb-2">{LOOKS[0].title}</h3>
              <p className="text-[10px] tracking-[0.2em] uppercase opacity-80 mb-6">{LOOKS[0].items}</p>
              <Link href={LOOKS[0].link} className="inline-flex items-center gap-2 bg-white text-[#1B2A4E] px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all">
                <ShoppingBag size={14} /> Shop Look
              </Link>
            </div>
          </div>

          {/* Side Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {LOOKS.slice(1).map((look) => (
              <div key={look.id} className="relative flex-1 group overflow-hidden rounded-sm bg-[#fbf7ed]">
                <img 
                  src={look.image} 
                  alt={look.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-serif mb-1">{look.title}</h3>
                  <Link href={look.link} className="text-[9px] font-bold uppercase tracking-widest border-b border-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all pb-1">
                    Explore
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}