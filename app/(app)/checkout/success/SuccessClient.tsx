"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface SuccessClientProps {
  session: {
    id: string;
    customerEmail?: string | null;
    customerName?: string | null;
    amountTotal?: number | null;
    paymentStatus: string;
    shippingAddress?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    lineItems?: {
      name?: string | null;
      quantity?: number | null;
      amount: number;
    }[];
  };
}

export function SuccessClient({ session }: SuccessClientProps) {
  const { clearCart } = useCartActions();
  const hasSentEmail = useRef(false); // 🟢 Prevents sending multiple emails on refresh

  useEffect(() => {
    // 1. Clear the local cart
    clearCart();

    // 2. 🟢 Trigger the "Order Confirmed" email immediately with real data
    if (!hasSentEmail.current && session.paymentStatus === "paid") {
      const sendConfirmation = async () => {
        try {
          await fetch("/api/notify-shipping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.customerEmail,
              customerName: session.customerName || "Valued Customer",
              orderNumber: session.id.slice(-8).toUpperCase(),
              status: "confirmed", // 🟢 This ensures the template shows "Order Confirmed"
              totalPrice: (session.amountTotal ?? 0) / 100, // 🟢 Correct Price from Stripe
              orderItems:
                session.lineItems?.map((item) => ({
                  productName: item.name,
                  quantity: item.quantity,
                  price: item.amount / 100,
                  image: "", // Note: Stripe line items don't include image URLs by default
                })) || [],
            }),
          });
          hasSentEmail.current = true;
        } catch (err) {
          console.error("Failed to send confirmation email:", err);
        }
      };
      sendConfirmation();
    }
  }, [clearCart, session]);

  const address = session.shippingAddress;

  return (
    <div className="min-h-screen bg-white mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-black">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. We&apos;ve sent a confirmation to{" "}
          <span className="font-medium text-black">
            {session.customerEmail}
          </span>
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-black">Order Details</h2>
        </div>

        <div className="px-6 py-4">
          {session.lineItems && session.lineItems.length > 0 && (
            <div className="space-y-3">
              {session.lineItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-black">
                    {formatPrice(item.amount / 100)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-black">Total</span>
              <span className="text-black">
                {formatPrice((session.amountTotal ?? 0) / 100)}
              </span>
            </div>
          </div>
        </div>

        {address && (
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-sm font-medium text-black">Shipping to</h3>
            <div className="mt-2 text-sm text-gray-600">
              {session.customerName && <p>{session.customerName}</p>}
              {address.line1 && <p>{address.line1}</p>}
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {[address.city, address.state, address.postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {address.country && <p>{address.country}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          asChild
          variant="outline"
          className="border-gray-300 text-black hover:bg-gray-50"
        >
          <Link href="/orders">
            View Your Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="bg-black text-white hover:bg-gray-800">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
