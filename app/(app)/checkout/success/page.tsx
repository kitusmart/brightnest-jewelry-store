import { redirect } from "next/navigation";
import { SuccessClient } from "./SuccessClient";
import { stripe } from "@/lib/stripe";

export const metadata = {
  title: "Order Confirmed | Elysia Luxe",
  description: "Your luxury jewelry order has been placed successfully",
};

interface SuccessPageProps {
  // 🟢 CHANGED: We now listen for 'payment_intent' instead of 'session_id'
  searchParams: Promise<{ payment_intent?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;

  // 🟢 FIXED: If no payment ID is found, redirect to home.
  // Stripe automatically appends '?payment_intent=...' after confirmPayment.
  if (!paymentIntentId) {
    redirect("/");
  }

  try {
    // 🟢 FETCH: We retrieve the Payment Intent directly from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 🟢 VERIFY: Ensure the status is 'succeeded' before showing the success UI
    if (paymentIntent.status !== "succeeded") {
      redirect("/");
    }

    // 🟢 MAPPING: We create a 'mockSession' so your existing SuccessClient
    // component gets exactly the data keys it expects.
    const mockSession = {
      id: paymentIntent.id,
      // 🟢 FIX 1: Renamed from 'amount_total' to 'amountTotal' to match SuccessClient props
      amountTotal: paymentIntent.amount,
      currency: paymentIntent.currency,
      // 🟢 FIX 2: Added 'status' so the client can verify it is "paid"
      status: paymentIntent.status,
      // 🟢 FIX 3: Added 'metadata' so the client can read the 'orderItems' list
      metadata: paymentIntent.metadata,
      customer_details: {
        email:
          paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail,
        name:
          paymentIntent.shipping?.name || paymentIntent.metadata?.customerName,
      },
    };

    return <SuccessClient session={mockSession as any} />;
  } catch (error) {
    console.error("Success Page Error:", error);
    redirect("/");
  }
}
