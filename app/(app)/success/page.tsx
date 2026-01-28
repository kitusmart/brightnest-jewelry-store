import { getOrderById } from "../../../sanity/lib/orders/getOrderById";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
// We move the cart clearing to a small client component to keep this page fast
import ClearCart from "../../../components/ClearCart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  // Fetch the order using the Stripe Session ID
  const order = session_id ? await getOrderById(session_id) : null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
      {/* 🟢 This client component will clear the cart on the browser side */}
      <ClearCart />

      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-8 p-6 bg-[#fbf7ed] rounded-full animate-in zoom-in duration-700">
          <CheckCircle size={64} className="text-[#D4AF37]" />
        </div>

        <h1 className="text-4xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-4">
          Order Confirmed
        </h1>

        {/* 🟢 Displaying real order data from Sanity */}
        <div className="mb-8 space-y-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Order Reference
          </p>
          <p className="text-xs font-mono text-gray-800 break-all px-4">
            {order?.orderNumber || session_id}
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed tracking-wide mb-10 uppercase font-medium">
          Thank you for choosing{" "}
          <span className="text-black font-bold">BRIGHTNEST</span>. Your
          exquisite jewelry is being prepared for delivery.
        </p>

        {/* 🟢 Show Tracking ID if you have already published it in Sanity */}
        {order?.trackingNumber && (
          <div className="mb-10 p-4 border-2 border-[#D4AF37] rounded-2xl w-full">
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-black mb-1">
              Tracking Number
            </p>
            <p className="text-lg font-serif tracking-widest text-black">
              {order.trackingNumber}
            </p>
          </div>
        )}

        <div className="flex flex-col w-full gap-4">
          <Link
            href="/"
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Continue Shopping
          </Link>

          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] pt-4">
            Elevate Your Shine
          </p>
        </div>
      </div>
    </div>
  );
}
