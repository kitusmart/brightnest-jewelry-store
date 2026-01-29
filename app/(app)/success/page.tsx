import { getOrderById } from "../../../sanity/lib/orders/getOrderById";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import ClearCart from "@/components/ClearCart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const session_id = params.session_id;

  // Fetch the order from Sanity to display the real Order Number
  const order = session_id ? await getOrderById(session_id) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-32">
      {/* Client component to clear the Zustand/Local cart state after successful purchase */}
      <ClearCart />

      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        {/* 1. LUXURY CONFIRMATION ICON */}
        <div className="mb-10 p-10 bg-[#fbf7ed] rounded-full animate-in zoom-in duration-1000">
          <CheckCircle2
            size={60}
            strokeWidth={1.5}
            className="text-[#D4AF37]"
          />
        </div>

        {/* 2. BRANDED HEADLINES */}
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Investment Confirmed
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-[#1B2A4E] uppercase tracking-tight mb-8">
          Your Shine is on its Way
        </h1>

        <p className="text-gray-400 text-[11px] uppercase tracking-[0.3em] mb-12 max-w-md leading-loose">
          Thank you for choosing{" "}
          <span className="text-[#1B2A4E] font-black">BRIGHTNEST</span>. Your
          pieces are being carefully placed in our nest for their journey to
          you.
        </p>

        {/* 3. ORDER INFO CARD: MIDNIGHT & CREAM THEME */}
        <div className="w-full bg-[#fbf7ed]/30 border border-[#fbf7ed] p-10 mb-12 shadow-sm group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Order Ref */}
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-[#1B2A4E]/5 pb-8 md:pb-0 md:pr-10">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-3">
                Order Reference
              </p>
              <p className="text-sm font-mono font-bold text-[#1B2A4E] tracking-widest uppercase">
                {order?.orderNumber || "Securing Ref..."}
              </p>
            </div>

            {/* Dashboard Link */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-3">
                Manage Collection
              </p>
              <Link
                href="/orders"
                className="group flex items-center gap-2 text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] hover:text-[#1B2A4E] transition-all"
              >
                Purchase History{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-2 transition-transform duration-500"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. TRACKING BOX (Conditional) */}
        {order?.trackingNumber && (
          <div className="mb-12 p-8 border border-[#D4AF37]/30 w-full bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package size={18} className="text-[#D4AF37]" />
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.4em] font-black">
                Tracking Dispatched
              </p>
            </div>
            <p className="text-3xl font-serif tracking-[0.3em] text-[#1B2A4E]">
              {order.trackingNumber}
            </p>
          </div>
        )}

        {/* 5. PRIMARY ACTION: MIDNIGHT BLUE BUTTON */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Link
            href="/"
            className="w-full bg-[#1B2A4E] text-white py-6 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-[#D4AF37] transition-all duration-700 shadow-2xl flex items-center justify-center gap-3"
          >
            <ShoppingBag size={14} /> Continue Journey
          </Link>

          <Link
            href="https://wa.me/919985394369?text=Hello%20Brightnest!%20I%20just%20placed%20an%20order."
            target="_blank"
            className="flex items-center justify-center gap-2 text-gray-400 text-[9px] uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-all"
          >
            <MessageCircle size={14} /> Concierge Assistance
          </Link>
        </div>
      </div>
    </div>
  );
}
