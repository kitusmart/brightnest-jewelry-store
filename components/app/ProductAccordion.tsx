"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const DETAILS = [
  {
    id: "materials",
    title: "Material & Craftsmanship",
    content: "Hand-finished 18K Gold plating over premium surgical-grade steel. Each piece is tarnish-resistant, waterproof, and hypoallergenic for daily elegance."
  },
  {
    id: "shipping",
    title: "Delivery & Returns",
    content: "Complimentary express shipping on all luxury orders. Returns are accepted within 30 days in original packaging for a full refund or exchange."
  },
  {
    id: "care",
    title: "Jewelry Care",
    content: "Avoid contact with heavy perfumes or chlorine. Gently wipe with a soft microfiber cloth after wear to maintain its signature radiant luster."
  }
];

export function ProductAccordion() {
  const [openId, setOpenId] = useState<string | null>("materials");

  return (
    <div className="mt-12 border-t border-gray-100">
      {DETAILS.map((item) => (
        <div key={item.id} className="border-b border-gray-100">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full py-6 flex justify-between items-center group text-left"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1B2A4E] group-hover:text-[#D4AF37] transition-colors">
              {item.title}
            </span>
            <ChevronDown 
              size={14} 
              className={`text-gray-400 transition-transform duration-500 ${openId === item.id ? "rotate-180" : ""}`} 
            />
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-8 text-sm text-gray-500 font-light leading-relaxed italic pr-4">
                  {item.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}