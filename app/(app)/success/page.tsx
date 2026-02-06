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
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white px-4">
      {/* Client component to clear the cart */}
      <ClearCart />

      <div className="flex flex-col items-center text-center max-w-xl w-full">
        {/* 1. LUXURY CONFIRMATION ICON (Compact) */}
        <div className="mb-6 animate-in zoom-in duration-700">
          <div className="w-16 h-16 rounded-full bg-[#fbf7ed] flex items-center justify-center">
            <CheckCircle2
              size={32}
              strokeWidth={1.5}
              className="text-[#D4AF37]"
            />
          </div>
        </div>

        {/* 2. BRANDED HEADLINES */}
        <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
          Order Confirmed
        </span>

        <h1 className="text-3xl md:text-5xl font-serif text-[#1B2A4E] uppercase tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          Your Shine is on its Way
        </h1>

        <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-10 max-w-md leading-loose animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Thank you for choosing{" "}
          <span className="text-[#1B2A4E] font-bold">Elysia Luxe</span>. Your
          pieces are being prepared with the utmost care for their journey to
          you.
        </p>

        {/* 3. ORDER INFO CARD: COMPACT */}
        <div className="w-full bg-[#FAFAFA] border border-[#f0f0f0] p-6 mb-8 rounded-sm animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Order Ref */}
            <div className="text-center md:text-left">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                Order Reference
              </p>
              <p className="text-sm font-mono font-bold text-[#1B2A4E] tracking-widest uppercase">
                {order?.orderNumber || "Securing Ref..."}
              </p>
            </div>

            {/* Dashboard Link */}
            <Link
              href="/orders"
              className="group flex items-center gap-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] hover:text-[#1B2A4E] transition-all"
            >
              Purchase History{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* 4. TRACKING BOX (Conditional) */}
        {order?.trackingNumber && (
          <div className="mb-8 w-full border border-[#D4AF37]/30 p-4 bg-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Package size={16} className="text-[#D4AF37]" />
              <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold">
                Tracking Dispatched
              </p>
            </div>
            <p className="text-xl font-serif tracking-[0.2em] text-[#1B2A4E]">
              {order.trackingNumber}
            </p>
          </div>
        )}

        {/* 5. ACTION BUTTONS */}
        <div className="flex flex-col gap-5 w-full max-w-xs animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
          <Link
            href="/"
            className="w-full bg-[#1B2A4E] text-white py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#2a3449] transition-all shadow-xl flex items-center justify-center gap-3 rounded-none"
          >
            <ShoppingBag size={14} /> Continue Journey
          </Link>

          <Link
            href="https://wa.me/919985394369?text=Hello%20Elysia%20Luxe!%20I%20just%20placed%20an%20order."
            target="_blank"
            className="flex items-center justify-center gap-2 text-gray-400 text-[9px] uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-all"
          >
            <MessageCircle size={14} /> Concierge Assistance
          </Link>
        </div>
      </div>
    </div>
  );
}
