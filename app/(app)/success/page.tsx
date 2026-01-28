import { getOrderById } from "../../../sanity/lib/orders/getOrderById";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, MessageCircle } from "lucide-react";
import ClearCart from "@/components/ClearCart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const session_id = params.session_id;

  // Fetch the order from Sanity
  const order = session_id ? await getOrderById(session_id) : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
      <ClearCart />

      <div className="flex flex-col items-center text-center max-w-xl w-full">
        {/* 1. LUXURY ANIMATED ICON */}
        <div className="mb-10 p-8 bg-[#fbf7ed] rounded-full animate-in zoom-in duration-500">
          <CheckCircle size={80} strokeWidth={1} className="text-[#D4AF37]" />
        </div>

        {/* 2. ELEGANT HEADLINE */}
        <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] tracking-[0.15em] uppercase mb-6">
          Your Shine is on its Way
        </h1>

        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-12">
          Thank you for trusting <span className="text-black font-bold">BRIGHTNEST</span> with your style.
        </p>

        {/* 3. ORDER INFO CARD (LUXURY STYLE) */}
        <div className="w-full bg-zinc-50 border border-[#fbf7ed] rounded-3xl p-8 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            
            {/* Order Ref */}
            <div className="pb-6 md:pb-0">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-2">Order Reference</p>
              <p className="text-sm font-mono font-bold text-zinc-800 tracking-tighter uppercase">
                {order?.orderNumber || "Processing..."}
              </p>
            </div>

            {/* Account Link */}
            <div className="pt-6 md:pt-0 md:pl-8">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black mb-2">Manage Order</p>
              <Link 
                href="/orders" 
                className="group flex items-center justify-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-black transition"
              >
                View Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. TRACKING BOX (ONLY IF DISPATCHED) */}
        {order?.trackingNumber && (
          <div className="mb-10 p-6 border-2 border-[#D4AF37] rounded-2xl w-full bg-[#fbf7ed]/50 animate-pulse">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package size={16} className="text-[#D4AF37]" />
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-black">Tracking Dispatched</p>
            </div>
            <p className="text-2xl font-serif tracking-[0.2em] text-black">
              {order.trackingNumber}
            </p>
          </div>
        )}

        {/* 5. ACTION BUTTONS */}
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/"
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#D4AF37] transition-all shadow-lg"
          >
            Explore New Arrivals
          </Link>
          
          <Link
            href="https://wa.me/919985394369?text=Hello%20Brightnest!%20I%20just%20placed%20an%20order."
            target="_blank"
            className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] uppercase tracking-widest hover:text-green-600 transition"
          >
            <MessageCircle size={14} /> Need immediate help? Chat with us
          </Link>
        </div>
      </div>
    </div>
  );
}