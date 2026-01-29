"use client";

import { ShieldCheck, Truck, RefreshCcw, Clock } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* HEADER SECTION */}
      <section className="bg-[#1B2A4E] py-24 text-center">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block animate-in fade-in slide-in-from-bottom-3 duration-1000">
          Trust & Transparency
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tight mb-6">
          Store Policies
        </h1>
        <div className="h-px w-20 bg-[#D4AF37] mx-auto opacity-30" />
      </section>

      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-[#1B2A4E] font-serif text-lg text-center mb-20 italic">
          "Your peace of mind is as precious as the pieces we craft."
        </p>

        <div className="grid gap-20">
          {/* Shipping Policy */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-[#D4AF37]">
              <Truck className="h-6 w-6 stroke-[1.5px]" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#1B2A4E]">
                Insured Shipping
              </h2>
            </div>
            <div className="bg-[#fbf7ed]/30 p-10 border border-[#fbf7ed] text-[#1B2A4E] leading-loose font-light italic text-[13px]">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    Orders are meticulously prepared and dispatched within 24-48
                    hours.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    Complimentary insured shipping is provided for all prepaid
                    collections across India.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    Expected delivery window is 3-7 business days from the
                    moment of dispatch.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Refund & Return Policy */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 text-[#D4AF37]">
              <RefreshCcw className="h-6 w-6 stroke-[1.5px]" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#1B2A4E]">
                Returns & Restorations
              </h2>
            </div>
            <div className="bg-[#fbf7ed]/30 p-10 border border-[#fbf7ed] text-[#1B2A4E] leading-loose font-light italic text-[13px]">
              <p className="mb-6 font-medium text-[#1B2A4E] not-italic">
                We want you to love your shine. If you aren't satisfied, we are
                here to help.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    We offer a 7-day return grace period from the date of
                    arrival.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    Jewelry must be in its original "Nest" packaging, unworn and
                    pristine.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#D4AF37] mt-1">✦</span>
                  <span>
                    Due to hygiene standards, earrings are only eligible for
                    return if defective upon arrival.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* TRUST BADGE */}
        <div className="mt-32 pt-12 border-t border-gray-100 flex justify-center gap-12 opacity-40 grayscale">
          <ShieldCheck size={20} />
          <Clock size={20} />
          <Truck size={20} />
        </div>
      </div>
    </div>
  );
}
