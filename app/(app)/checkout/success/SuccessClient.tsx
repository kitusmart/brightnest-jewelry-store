"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartActions } from "@/lib/store/cart-store-provider";
// 🟢 1. Import Clerk hook to check if user is logged in
import { useUser } from "@clerk/nextjs";

interface SuccessClientProps {
  session: {
    id: string;
    customerEmail?: string | null;
    customerName?: string | null;
    amountTotal?: number | null;
    status?: string;
    metadata?: {
      sanityIds?: string;
      quantities?: string;
      orderItems?: string;
    } | null;
  };
}

export function SuccessClient({ session }: SuccessClientProps) {
  const { clearCart } = useCartActions();
  const hasCleared = useRef(false);
  // 🟢 2. Get the sign-in status
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  const itemsToDisplay = session.metadata?.orderItems
    ? JSON.parse(session.metadata.orderItems)
    : [];

  return (
    <div className="min-h-screen bg-white mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-[#1B2A4E]">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. We&apos;ve sent a confirmation to{" "}
          <span className="font-medium text-black">
            {session.customerEmail}
          </span>
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <h2 className="font-semibold text-[#1B2A4E]">Order Details</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-6">
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  {/* Product Image Display */}
                  {item.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.productName || "Luxury Jewelry"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="font-medium text-black">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">
                Processing items...
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-base font-bold">
              <span className="text-[#1B2A4E]">Total Paid</span>
              <span className="text-[#D4AF37]">
                {formatPrice((session.amountTotal ?? 0) / 100)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {/* 🟢 3. CONDITIONAL RENDER: Only show this button if user is logged in */}
        {isSignedIn && (
          <Button
            asChild
            variant="outline"
            className="border-gray-200 text-[#1B2A4E] hover:bg-gray-50"
          >
            <Link href="/orders">
              View Your Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}

        <Button
          asChild
          className="bg-[#1B2A4E] text-white hover:bg-[#D4AF37] transition-colors"
        >
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
