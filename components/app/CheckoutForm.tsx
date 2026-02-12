"use client";

import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

// 🟢 FIX: No store import needed here. Cleaner and error-free.

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Details */}
      <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 shadow-sm">
        <h3 className="text-[#1B2A4E] text-xl font-serif mb-4">
          Shipping Details
        </h3>
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["AU"],
          }}
        />
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 shadow-sm">
        <h3 className="text-[#1B2A4E] text-xl font-serif mb-4">
          Payment Method
        </h3>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {/* Error Message */}
      {message && (
        <div className="p-4 text-red-800 bg-red-50 rounded-md text-sm">
          {message}
        </div>
      )}

      {/* Pay Button */}
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#1B2A4E] hover:bg-[#2a3f70] text-white font-medium py-4 px-6 rounded-md transition-all duration-300 flex justify-center items-center disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "PAY NOW"}
      </button>
    </form>
  );
}
