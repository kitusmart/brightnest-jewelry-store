// app/success/page.tsx
import { getOrderById } from "../../../sanity/lib/orders/getOrderById";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import ClearCart from "@/components/ClearCart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>; // Made optional for safety
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const session_id = params.session_id;

  // Try to fetch the order ONLY if we have a session_id
  const order = session_id ? await getOrderById(session_id) : null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      <ClearCart />

      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-8 p-6 bg-[#fbf7ed] rounded-full">
          <CheckCircle size={64} className="text-[#D4AF37]" />
        </div>

        <h1 className="text-4xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-4">
          Order Confirmed
        </h1>

        <div className="mb-8 space-y-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Order Reference
          </p>
          <p className="text-xs font-mono text-gray-800 break-all px-4">
            {/* 🟢 This will now show the number from Sanity if found */}
            {order?.orderNumber || "Processing..."}
          </p>
        </div>

        {/* 🟢 NEW: This is the box that was missing! */}
        {order?.trackingNumber && (
          <div className="mb-8 p-6 border-2 border-[#D4AF37] rounded-xl w-full bg-[#fbf7ed]/30">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-black mb-2">
              Your Tracking Number
            </p>
            <p className="text-xl font-serif tracking-[0.2em] text-black">
              {order.trackingNumber}
            </p>
          </div>
        )}

        <p className="text-gray-500 text-[11px] leading-relaxed tracking-wide mb-10 uppercase font-medium">
          Thank you for choosing{" "}
          <span className="text-black font-bold">BRIGHTNEST</span>. Your
          exquisite jewelry is being prepared for delivery.
        </p>

        <Link
          href="/"
          className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#D4AF37] transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
