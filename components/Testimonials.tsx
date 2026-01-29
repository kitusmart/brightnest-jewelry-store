"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    name: "Elena V.",
    text: "The craftsmanship of the Evil Eye necklace is beyond words. It feels heavy, luxurious, and truly radiant.",
    product: "Crystal Evil Eye Necklace"
  },
  {
    id: 2,
    name: "Marcus T.",
    text: "Found the perfect engagement ring here. The bespoke service and attention to detail are world-class.",
    product: "Eternal Ring Collection"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#fbf7ed]/50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase">Testimonials</span>
        <h2 className="text-4xl font-serif text-[#1B2A4E] mt-6 mb-16">CUSTOMER RADIANCE</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {REVIEWS.map((review) => (
            <div key={review.id} className="flex flex-col items-center">
              <div className="flex gap-1 mb-6 text-[#D4AF37]">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#D4AF37" />)}
              </div>
              <p className="text-lg text-[#1B2A4E] font-light italic leading-relaxed mb-6">
                "{review.text}"
              </p>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">— {review.name}</span>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{review.product}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}