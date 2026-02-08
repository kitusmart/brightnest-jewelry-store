"use client";

import { useState, useEffect } from "react"; // 🟢 Added for Address Fetching
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
  MapPin, // 🟢 Added for Address UI
} from "lucide-react";
import { CheckoutButton } from "@/components/app/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
// 🟢 IMPORT FETCHING LOGIC
import { getAddresses } from "@/app/actions/saveAddress";
import { useUser } from "@clerk/nextjs";

export function CheckoutClient() {
  const { isLoaded, user } = useUser();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  // 🟢 STATE FOR DEFAULT ADDRESS
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  // 🟢 FETCH DEFAULT ADDRESS ON LOAD
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

  // 1. EMPTY NEST STATE
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#fbf7ed] rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="h-10 w-10 text-[#D4AF37] opacity-60" />
        </div>
        <h1 className="font-serif text-3xl text-[#1B2A4E] mb-6 uppercase tracking-[0.3em]">
          Your Nest is Empty
        </h1>
        <p className="text-gray-400 font-light italic mb-10 max-w-xs">
          Discover our collection of handcrafted brilliance to fill your nest.
        </p>
        <Link
          href="/"
          className="bg-[#1B2A4E] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-700 shadow-xl"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* 2. LEFT COLUMN: ITEMS & SHIPPING */}
        <div className="p-8 lg:p-16 border-r border-gray-50 bg-white">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#D4AF37] transition-colors mb-12"
          >
            <ChevronLeft size={14} /> Back to Collection
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl font-serif text-[#1B2A4E] tracking-tight uppercase mb-2">
              Review Your Nest
            </h1>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Lock size={12} className="text-[#D4AF37]" /> {totalItems}{" "}
              Handpicked Items
            </p>
          </header>

          {/* 🟢 NEW: SHIPPING ADDRESS SUMMARY (AUSTRALIA) */}
          <div className="mb-12 border-b border-gray-50 pb-12">
            <h2 className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-[0.4em] mb-6">
              Shipping Destination
            </h2>

            {isAddressLoading ? (
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Locating default
                nest...
              </div>
            ) : defaultAddress ? (
              <div className="bg-[#fbf7ed]/40 p-6 border border-[#D4AF37]/10 relative group transition-all">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-[#D4AF37] mt-1" />
                  <div>
                    <p className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-wider mb-1">
                      {defaultAddress.firstName} {defaultAddress.lastName}
                    </p>
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                      {defaultAddress.addressLine}
                      {defaultAddress.apartment
                        ? `, ${defaultAddress.apartment}`
                        : ""}
                      <br />
                      {defaultAddress.city}, {defaultAddress.state}{" "}
                      {defaultAddress.postcode}
                      <br />
                      Australia (+61) {defaultAddress.phone}
                    </p>
                  </div>
                </div>
                <Link
                  href="/account"
                  className="absolute top-6 right-6 text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline"
                >
                  Change
                </Link>
              </div>
            ) : (
              <div className="bg-red-50/50 p-6 border border-red-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest">
                  No default address found
                </p>
                <Link
                  href="/account"
                  className="bg-[#1B2A4E] text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest shadow-lg"
                >
                  Add Now
                </Link>
              </div>
            )}
          </div>

          {/* Stock Issues Warning */}
          {hasStockIssues && !isLoading && (
            <div className="mb-8 flex items-center gap-3 rounded-none border border-red-100 bg-red-50/50 px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-red-800">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Some pieces in your nest have stock limitations.</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3 py-8 text-[#D4AF37]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Verifying Radiance...
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="divide-y divide-gray-50">
            {items.map((item) => {
              const stockInfo = stockMap.get(item.productId);
              const hasIssue =
                stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

              return (
                <div
                  key={item.productId}
                  className={`flex gap-6 py-8 transition-all duration-500 ${hasIssue ? "opacity-70" : ""}`}
                >
                  <div className="relative h-24 w-20 bg-[#F9F9F9] border border-gray-100 shrink-0 shadow-sm">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[8px] text-gray-300 uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-[13px] text-[#1B2A4E] uppercase tracking-wider leading-snug">
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                          Qty: {item.quantity}
                        </span>
                      </div>

                      {stockInfo?.isOutOfStock && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-600">
                          Archive Only (Out of Stock)
                        </p>
                      )}
                      {stockInfo?.exceedsStock && !stockInfo.isOutOfStock && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
                          Only {stockInfo.currentStock} Available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[12px] font-bold text-[#1B2A4E] tracking-widest">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. RIGHT COLUMN: PAYMENT SUMMARY */}
        <div className="bg-[#fbf7ed]/30 p-8 lg:p-16 flex flex-col h-full lg:sticky lg:top-0">
          <h2 className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-[0.4em] mb-10 pb-4 border-b border-[#1B2A4E]/5">
            Payment Summary
          </h2>

          <div className="space-y-6 bg-white p-8 border border-[#1B2A4E]/5 shadow-sm">
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span className="text-[#1B2A4E] font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              <span>Insured Shipping</span>
              <span className="text-[#D4AF37] font-bold tracking-widest">
                Complimentary
              </span>
            </div>
            <div className="h-px bg-[#1B2A4E]/5 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-[#1B2A4E] uppercase tracking-[0.4em]">
                Total Balance
              </span>
              <span className="text-2xl font-bold text-[#1B2A4E]">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <div className="mt-10">
            {/* 🟢 THE BUTTON IS NOW DISABLED IF NO ADDRESS EXISTS */}
            <CheckoutButton
              disabled={hasStockIssues || isLoading || !defaultAddress}
            />

            {!defaultAddress && !isAddressLoading && (
              <p className="mt-3 text-[9px] text-red-500 uppercase tracking-widest text-center font-bold">
                Please add a shipping address in your profile to proceed.
              </p>
            )}

            <p className="mt-6 text-center text-[9px] text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Lock size={10} className="text-[#D4AF37]" /> Encrypted via Stripe
              Secure
            </p>
          </div>

          <div className="mt-auto pt-12 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-3 bg-white/50 p-6 text-center border border-gray-100 hover:border-[#D4AF37] transition-all duration-500">
              <Truck size={18} className="text-[#D4AF37] stroke-[1.2]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1B2A4E]">
                Insured Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white/50 p-6 text-center border border-gray-100 hover:border-[#D4AF37] transition-all duration-500">
              <ShieldCheck size={18} className="text-[#D4AF37] stroke-[1.2]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1B2A4E]">
                Luster Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
