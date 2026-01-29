"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Diamond } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#1B2A4E]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/gold-texture.jpg')] bg-cover bg-center mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center px-4">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.6em] mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The Brightnest Heritage
          </span>
          <h1 className="text-4xl md:text-7xl font-serif text-white tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Elevate Your <span className="italic">Radiance</span>
          </h1>
          <div className="h-px w-20 bg-[#D4AF37] mx-auto opacity-50" />
        </div>
      </section>

      {/* 2. THE PHILOSOPHY */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-6">
              Our Philosophy
            </h2>
            <h3 className="text-3xl font-serif text-[#1B2A4E] leading-snug mb-8">
              Crafting timeless elegance for the modern woman.
            </h3>
          </div>
          <div className="space-y-6 text-sm text-gray-600 font-light leading-loose italic">
            <p>
              At Brightnest, we believe that jewelry is more than an
              accessory—it is a reflection of your inner light. Founded on the
              principles of quality and sophistication, we curate pieces that
              transition seamlessly from daylight to starlight.
            </p>
            <p>
              Every piece in our collection is selected with a meticulous eye
              for detail, ensuring that our "Nest" only holds the finest
              treasures for yours.
            </p>
          </div>
        </div>
      </section>

      {/* 3. QUALITY STANDARDS GRID */}
      <section className="bg-[#fbf7ed]/50 py-24 border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.5em] mb-4">
              The Brightnest Standard
            </h2>
            <p className="text-sm text-gray-400 font-light italic">
              Uncompromising quality in every golden link.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <QualityFeature
              Icon={Diamond}
              title="18K Gold Plating"
              desc="Premium surgical-grade steel finished with 18K gold for lasting brilliance."
            />
            <QualityFeature
              Icon={ShieldCheck}
              title="Anti-Tarnish"
              desc="Waterproof and sweat-resistant jewelry designed for daily radiance."
            />
            <QualityFeature
              Icon={Sparkles}
              title="Hand-Finished"
              desc="Meticulously polished by master artisans to ensure a flawless luster."
            />
            <QualityFeature
              Icon={Heart}
              title="Hypoallergenic"
              desc="Nickel-free and lead-free compositions, safe for the most sensitive skin."
            />
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-32 text-center">
        <h2 className="text-2xl font-serif text-[#1B2A4E] mb-10 tracking-tight">
          Your Journey to Shine Begins Here
        </h2>
        <Link
          href="/"
          className="inline-block bg-[#1B2A4E] text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-700 shadow-2xl active:scale-95"
        >
          Explore the Collection
        </Link>
      </section>
    </div>
  );
}

function QualityFeature({
  Icon,
  title,
  desc,
}: {
  Icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:border-[#D4AF37] transition-colors duration-500">
        <Icon size={24} className="text-[#D4AF37] stroke-[1px]" />
      </div>
      <h4 className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-[0.2em] mb-4">
        {title}
      </h4>
      <p className="text-[11px] text-gray-500 font-light leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
