"use client"; // This tells Next.js this part is safe for the browser

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black transition-colors"
    >
      <Printer className="h-4 w-4" /> Order Summary
    </button>
  );
}