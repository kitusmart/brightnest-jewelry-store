import { Sparkles, Droplets, Wind, ShieldAlert } from "lucide-react";

export default function CareGuide() {
  const careTips = [
    {
      title: "The 'Last On, First Off' Rule",
      description: "Always put your jewelry on last after applying makeup, perfume, and hairspray. Take it off first when you return home.",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Keep it Dry",
      description: "Remove your pieces before showering, swimming, or exercising. Water and sweat can dull the gold plating over time.",
      icon: <Droplets className="h-6 w-6" />,
    },
    {
      title: "Store Smartly",
      description: "Store each piece separately in an airtight pouch or a lined jewelry box to prevent scratches and tangling.",
      icon: <Wind className="h-6 w-6" />,
    },
    {
      title: "Clean Gently",
      description: "Wipe your jewelry with a soft, lint-free microfiber cloth after each wear to remove skin oils and dirt.",
      icon: <ShieldAlert className="h-6 w-6" />,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 font-serif">Jewelry Care Guide</h1>
        <p className="text-zinc-500 max-w-xl mx-auto italic">
          "Jewelry is like a biography. A story that tells the many chapters of our life." — Let's keep your story shining.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {careTips.map((tip, index) => (
          <div key={index} className="p-8 rounded-2xl border border-[#fbf7ed] bg-white shadow-sm hover:shadow-md transition">
            <div className="text-[#D4AF37] mb-4">{tip.icon}</div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 uppercase tracking-wide">{tip.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#fbf7ed] rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">A Note on Tarnish</h2>
        <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl mx-auto">
          All gold-plated jewelry eventually loses some luster, but proper care can extend its life by years. If your jewelry starts to look dull, gently clean it with warm (not hot) soapy water and a soft baby toothbrush. Always pat dry immediately with a soft cloth.
        </p>
      </div>
    </div>
  );
}