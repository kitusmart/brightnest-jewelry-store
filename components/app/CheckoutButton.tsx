"use client";

import { useState, useTransition } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCartItems } from "@/lib/store/cart-store-provider";
import { createCheckoutSession } from "@/lib/actions/checkout";

interface CheckoutButtonProps {
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const items = useCartItems();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    setError(null);

    startTransition(async () => {
      try {
        // Calls the server action which is hardcoded to AUD
        const result = await createCheckoutSession(items);

        if (result.success && result.url) {
          // Trigger the secure external redirect
          window.location.href = result.url;
        } else {
          const errorMsg = result.error ?? "The vault is temporarily locked.";
          setError(errorMsg);
          toast.error("Boutique Error", {
            description: errorMsg,
          });
        }
      } catch (err) {
        const fallbackError = "Unable to reach the payment vault.";
        setError(fallbackError);
        toast.error("Connection Error", {
          description: fallbackError,
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckout}
        disabled={disabled || isPending || items.length === 0}
        className="w-full bg-[#1B2A4E] text-white py-5 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-[#D4AF37] transition-all duration-700 flex items-center justify-center gap-3 disabled:bg-gray-100 disabled:text-gray-400 shadow-xl active:scale-[0.98] group"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
            <span className="animate-pulse">Opening Secure Vault...</span>
          </>
        ) : (
          <>
            <Lock
              size={14}
              className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-500"
            />
            Pay with Stripe (AUD)
          </>
        )}
      </button>

      {/* Error Feedback */}
      {error && (
        <p className="text-[10px] text-red-600 font-bold uppercase tracking-[0.2em] text-center bg-red-50 py-2">
          {error}
        </p>
      )}

      {/* Trust Signifiers for Australian Market */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <p className="text-center text-[9px] text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <ShieldCheck size={10} className="text-[#D4AF37]" />
          Secured for Australian Residents
        </p>
        <div className="flex gap-4 opacity-30 grayscale contrast-125">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
            alt="Stripe"
            className="h-3"
          />
        </div>
      </div>
    </div>
  );
}
