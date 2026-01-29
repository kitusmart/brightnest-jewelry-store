import { Sparkles, Droplets, ShieldCheck, Sun } from "lucide-react";

export default function CareGuidePage() {
  const tips = [
    {
      icon: <Droplets size={24} className="text-[#D4AF37]" />,
      title: "Avoid Moisture",
      desc: "Remove your jewelry before swimming, bathing, or exercising to maintain its original luster."
    },
    {
      icon: <Sun size={24} className="text-[#D4AF37]" />,
      title: "Storage is Key",
      desc: "Store your pieces in a cool, dry place, preferably in the Brightnest pouch provided to prevent scratching."
    },
    {
      icon: <Sparkles size={24} className="text-[#D4AF37]" />,
      title: "Gentle Cleaning",
      desc: "Use a soft, lint-free cloth to gently wipe away oils or dust. Avoid harsh chemical cleaners."
    },
    {
      icon: <ShieldCheck size={24} className="text-[#D4AF37]" />,
      title: "Last On, First Off",
      desc: "Put your jewelry on last after applying perfume or lotions, and take it off first when undressing."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-[#1B2A4E] tracking-tight uppercase mb-4">
            Jewelry Care Guide
          </h1>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-gray-500 font-light max-w-2xl mx-auto italic">
            "Your Brightnest pieces are designed to last a lifetime. Proper care ensures they remain as radiant as the day you first wore them."
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {tips.map((tip, index) => (
            <div key={index} className="flex flex-col gap-4 p-8 border border-gray-50 rounded-2xl hover:border-[#D4AF37]/20 transition-colors">
              <div className="bg-[#fbf7ed] w-12 h-12 rounded-full flex items-center justify-center">
                {tip.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1B2A4E] uppercase tracking-widest">
                {tip.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}