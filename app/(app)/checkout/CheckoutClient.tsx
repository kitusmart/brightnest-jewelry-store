"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ShoppingBag,
  AlertTriangle,
  Loader2,
  Lock,
  Truck,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { getAddresses } from "@/app/actions/saveAddress";
import { useUser } from "@clerk/nextjs";

// 🟢 NEW STRIPE IMPORTS
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/app/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function CheckoutClient() {
  const { isLoaded, user } = useUser();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  // 🟢 NEW: CLIENT SECRET STATE
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchDefault() {
      if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
        const addresses = await getAddresses(
          user.primaryEmailAddress.emailAddress,
        );
        const primary = addresses.find((addr: any) => addr.isDefault === true);
        setDefaultAddress(primary);
        setIsAddressLoading(false);
      }
    }
    fetchDefault();
  }, [isLoaded, user]);

  // 🟢 NEW: FETCH PAYMENT INTENT (CLIENT SECRET)
  useEffect(() => {
    if (items.length === 0) return;

    fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        isEmbedded: true, // Tells route.ts to use Embedded mode
        user_details: {
          email: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [items, user]);

  // 🎨 Custom Stripe Styling
  const appearance = {
    theme: "stripe" as const,
    variables: { colorPrimary: "#1B2A4E", fontFamily: "serif" },
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl text-[#1B2A4E] mb-6 uppercase tracking-[0.3em]">
          Your Nest is Empty
        </h1>
        <Link
          href="/"
          className="bg-[#1B2A4E] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT COLUMN: ITEMS (Preserved exactly) */}
        <div className="p-8 lg:p-16 border-r border-gray-50 bg-white overflow-y-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-12"
          >
            <ChevronLeft size={14} /> Back to Collection
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl font-serif text-[#1B2A4E] tracking-tight uppercase">
              Review Your Nest
            </h1>
          </header>

          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-6 py-8">
                <div className="relative h-24 w-20 bg-[#F9F9F9] border border-gray-100">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-serif text-[13px] text-[#1B2A4E] uppercase">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-[#1B2A4E]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: THE NEW PAYMENT FORM */}
        <div className="bg-[#fbf7ed]/30 p-8 lg:p-16 flex flex-col h-full lg:sticky lg:top-0">
          <h2 className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-[0.4em] mb-10 pb-4 border-b border-[#1B2A4E]/5">
            Secured Checkout
          </h2>

          <div className="bg-white p-8 border border-[#1B2A4E]/5 shadow-xl">
            {clientSecret ? (
              <Elements
                options={{ clientSecret, appearance }}
                stripe={stripePromise}
              >
                {/* 🟢 We replace the CheckoutButton with the actual Payment Form */}
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Initialising Payment Gateway...
                </span>
              </div>
            )}
          </div>

          {/* Luxury Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 opacity-60">
            <div className="flex flex-col items-center gap-3 text-center border p-4">
              <Truck size={18} className="text-[#D4AF37]" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Insured Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center border p-4">
              <ShieldCheck size={18} className="text-[#D4AF37]" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Luster Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
