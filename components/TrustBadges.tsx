"use client";

import { Truck, ShieldCheck, RefreshCw, Gem } from "lucide-react";

const BADGES = [
  {
    icon: <Truck size={24} strokeWidth={1} />,
    title: "Express Delivery",
    desc: "Complimentary shipping on all luxury orders"
  },
  {
    icon: <ShieldCheck size={24} strokeWidth={1} />,
    title: "Lifetime Warranty",
    desc: "Our commitment to enduring brilliance"
  },
  {
    icon: <RefreshCw size={24} strokeWidth={1} />,
    title: "Easy Returns",
    desc: "30-day window for a perfect selection"
  },
  {
    icon: <Gem size={24} strokeWidth={1} />,
    title: "Certified Quality",
    desc: "Authentic materials and ethical sourcing"
  }
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-t border-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {BADGES.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-6 p-4 rounded-full bg-[#fbf7ed] text-[#D4AF37] transition-transform duration-500 group-hover:scale-110">
                {badge.icon}
              </div>
              <h3 className="text-[#1B2A4E] text-[12px] font-bold tracking-[0.2em] uppercase mb-2">
                {badge.title}
              </h3>
              <p className="text-gray-400 text-[11px] font-light leading-relaxed max-w-[180px]">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}