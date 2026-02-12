"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@clerk/nextjs";
import { X, Loader2, Lock, ShieldCheck } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartItems } from "@/lib/store/cart-store-provider";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ amount, onClose, defaultValues }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🟢 1. Track the email state (defaults to empty for guests)
  const [email, setEmail] = useState(defaultValues.email || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        // 🟢 3. CRITICAL: Force Stripe to use the typed email, not "guest_pending"
        receipt_email: email,
      },
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Contact
        </label>
        <LinkAuthenticationElement
          // 🟢 2. Listen for typing changes
          onChange={(e) => setEmail(e.value.email)}
          options={{ defaultValues: { email: defaultValues.email } }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Shipping Address
        </label>
        <AddressElement
          options={{
            mode: "shipping",
            autocomplete: {
              mode: "disabled",
            },
            fields: {
              phone: "always",
            },
            validation: {
              phone: { required: "always" },
            },
            defaultValues: {
              name: defaultValues.name || "",
              address: {
                line1: defaultValues.address.line1 || "",
                city: defaultValues.address.city || "",
                state: defaultValues.address.state || "",
                postal_code: defaultValues.address.postal_code || "",
                country: "AU",
              },
              phone: defaultValues.phone || "",
            },
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Payment Method
        </label>
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: { applePay: "auto", googlePay: "auto" },
          }}
        />
      </div>

      {message && (
        <div className="text-red-500 text-xs bg-red-50 p-3 rounded">
          {message}
        </div>
      )}

      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#1B2A4E] text-white py-4 mt-6 uppercase tracking-[0.15em] text-xs font-bold hover:bg-[#D4AF37] transition-all disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay AUD $${amount}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
        <ShieldCheck size={12} />
        <span className="text-[10px] uppercase tracking-wider">
          Secure SSL Encryption
        </span>
      </div>
    </form>
  );
}

export function CheckoutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, isSignedIn } = useUser();
  const cartItems = useCartItems();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const getUserData = useCallback(() => {
    if (!isSignedIn || !user)
      return { email: "", name: "", address: { country: "AU" }, phone: "" };

    const metadata = user.publicMetadata?.address as any;

    return {
      email: user.primaryEmailAddress?.emailAddress || "",
      name: user.fullName || "",
      phone: user.primaryPhoneNumber?.phoneNumber?.replace("+61", "") || "",
      address: metadata
        ? {
            line1: metadata.street || "",
            city: metadata.city || "",
            state: metadata.state || "",
            postal_code: metadata.zipCode || "",
            country: "AU",
          }
        : { country: "AU" },
    };
  }, [isSignedIn, user]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      if (cartItems.length > 0 && !clientSecret) {
        const userData = getUserData();
        fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems, user_details: userData }),
        })
          .then((res) => res.json())
          .then((data) => setClientSecret(data.clientSecret))
          .catch((err) => console.error("Setup failed", err));
      }
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isOpen, cartItems, getUserData, clientSecret]);

  if (!mounted || !isOpen) return null;

  const userData = getUserData();

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans p-0 touch-none">
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] cursor-default" />

      <div className="relative z-50 w-full max-w-[500px] bg-white shadow-2xl flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B2A4E]">
              Secure Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white overscroll-contain">
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#1B2A4E",
                    fontFamily: '"Geist", sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                amount={totalAmount}
                onClose={onClose}
                defaultValues={userData}
              />
            </Elements>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
