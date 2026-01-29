"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ANATOMY_DATA = [
  {
    id: 1,
    top: "25%",
    left: "45%",
    title: "18K Solid Gold",
    description: "Crafted with premium 18k gold plating for a deep, lasting luster that won't fade."
  },
  {
    id: 2,
    top: "55%",
    left: "30%",
    title: "Hand-Set Stones",
    description: "Every stone is meticulously set by hand by our master artisans to ensure maximum brilliance."
  },
  {
    id: 3,
    top: "75%",
    left: "60%",
    title: "Signature Hallmark",
    description: "Discrete 'BN' engraving ensuring authenticity and the Brightnest quality guarantee."
  }
];

export default function JewelryAnatomy() {
  const [activePoint, setActivePoint] = useState(ANATOMY_DATA[0]);

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase">The Craftsmanship</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1B2A4E] mt-4 uppercase tracking-tight">Anatomy of Brilliance</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Interactive Image */}
          <div className="relative aspect-square bg-[#fbf7ed] rounded-2xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?q=80&w=2070&auto=format&fit=crop" 
              alt="Jewelry Detail" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {ANATOMY_DATA.map((point) => (
              <button
                key={point.id}
                style={{ top: point.top, left: point.left }}
                onClick={() => setActivePoint(point)}
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <span className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-75"></span>
                <span className={`absolute inset-0 rounded-full border-2 border-white transition-colors duration-300 ${activePoint.id === point.id ? 'bg-[#D4AF37]' : 'bg-[#1B2A4E]'}`}></span>
              </button>
            ))}
          </div>

          {/* Right Side: Detail Card */}
          <div className="flex flex-col justify-center">
            <motion.div
              key={activePoint.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#fbf7ed] p-10 md:p-16 rounded-3xl border border-[#D4AF37]/10"
            >
              <h3 className="text-[#1B2A4E] text-2xl font-serif mb-4 uppercase tracking-widest">{activePoint.title}</h3>
              <div className="w-12 h-1 bg-[#D4AF37] mb-8" />
              <p className="text-gray-500 font-light leading-relaxed text-lg italic">
                "{activePoint.description}"
              </p>
            </motion.div>
            
            <div className="mt-12 grid grid-cols-3 gap-4">
               {ANATOMY_DATA.map((point) => (
                 <button 
                   key={point.id}
                   onClick={() => setActivePoint(point)}
                   className={`h-1 transition-all duration-500 ${activePoint.id === point.id ? 'bg-[#D4AF37] w-full' : 'bg-gray-100 w-8'}`}
                 />
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}