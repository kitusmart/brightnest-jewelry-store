"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/919985394369?text=Hello%20Brightnest!%20I%20have%20a%20question%20about%20your%20jewelry."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip that appears on hover */}
      <span className="absolute right-16 bg-white text-zinc-800 text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-zinc-100">
        Need help? Chat with us!
      </span>
      
      <MessageCircle size={28} fill="currentColor" className="text-white" />
    </Link>
  );
}