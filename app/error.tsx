"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-[#fbf7ed] rounded-full flex items-center justify-center mb-8">
        <AlertCircle className="h-10 w-10 text-[#D4AF37]" />
      </div>

      <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4">
        Vault Interruption
      </span>
      <h2 className="text-3xl font-serif text-[#1B2A4E] uppercase tracking-tight mb-6">
        Something went astray
      </h2>
      <p className="text-gray-400 font-light italic mb-12 max-w-md leading-loose">
        We encountered a momentary disturbance in the nest. Please try
        refreshing or return to our main collection.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => reset()}
          className="bg-[#1B2A4E] text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all flex items-center gap-3"
        >
          <RefreshCcw size={14} /> Try Again
        </button>
        <Link
          href="/"
          className="border border-[#1B2A4E] text-[#1B2A4E] px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#1B2A4E] hover:text-white transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
