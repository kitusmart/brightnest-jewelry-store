"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const FEATURED_ITEMS = [
  {
    id: 1,
    title: "The Golden Hour",
    subtitle: "18K HAND-CRAFTED RINGS",
    description: "Discover the warmth of our signature gold collection, designed to catch every light.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
    link: "/?category=rings"
  },
  {
    id: 2,
    title: "Eternal Radiance",
    subtitle: "DIAMOND NEST COLLECTIONS",
    description: "Timeless pieces that transition seamlessly from daylight to starlight.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
    link: "/?category=necklaces"
  }
];

export default function FeaturedCarousel() {
  const [index, setIndex] = useState(0);

  // Auto-play feature for luxury experience
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % FEATURED_ITEMS.length);
  const prev = () => setIndex((prev) => (prev - 1 + FEATURED_ITEMS.length) % FEATURED_ITEMS.length);

  return (
    <section className="relative w-full h-[70vh] min-h-[600px] bg-[#fbf7ed] overflow-hidden border-b border-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 h-full"
        >
          {/* Text Content */}
          <div className="flex flex-col justify-center px-8 lg:px-24 order-2 lg:order-1 bg-white lg:bg-transparent py-12 lg:py-0">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-6"
            >
              {FEATURED_ITEMS[index].subtitle}
            </motion.span>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-7xl font-serif text-[#1B2A4E] leading-[1.1] mb-8 tracking-tight"
            >
              {FEATURED_ITEMS[index].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 font-light text-base md:text-lg max-w-md leading-relaxed mb-12 italic"
            >
              {FEATURED_ITEMS[index].description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href={FEATURED_ITEMS[index].link}
                className="group relative inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-[#1B2A4E]"
              >
                <span className="relative">
                  Explore Collection
                  <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#D4AF37] transform origin-left transition-transform duration-500 group-hover:scale-x-110" />
                </span>
                <ChevronRight size={14} className="text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="relative h-full overflow-hidden order-1 lg:order-2">
            <motion.div
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <img
                src={FEATURED_ITEMS[index].image}
                alt={FEATURED_ITEMS[index].title}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-black/5 lg:bg-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Minimalist Style */}
      <div className="absolute bottom-12 right-12 lg:right-24 flex items-center gap-8 z-20">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#1B2A4E]/40">
          <span>0{index + 1}</span>
          <div className="w-12 h-[1px] bg-gray-200 relative">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               key={index}
               transition={{ duration: 8, ease: "linear" }}
               className="absolute top-0 left-0 h-full bg-[#D4AF37]" 
             />
          </div>
          <span>0{FEATURED_ITEMS.length}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prev}
            className="group p-4 border border-[#1B2A4E]/10 rounded-full hover:border-[#D4AF37] transition-all duration-500"
          >
            <ChevronLeft size={18} className="text-[#1B2A4E] group-hover:text-[#D4AF37] transition-colors" />
          </button>
          <button 
            onClick={next}
            className="group p-4 border border-[#1B2A4E]/10 rounded-full hover:border-[#D4AF37] transition-all duration-500"
          >
            <ChevronRight size={18} className="text-[#1B2A4E] group-hover:text-[#D4AF37] transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
}