import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items, user_details } = await request.json();

    const amount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0,
    );

    const idList = items
      .map((item: any) => item.productId || item._id || item.id)
      .join(",");
    const quantityList = items.map((item: any) => item.quantity).join(",");

    const orderItemsMinimal = items.map((item: any) => ({
      productName: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || "",
    }));

    // 🟢 FIX: Prepare the email logic safely
    // If it's a guest (empty string), we send undefined so Stripe doesn't crash.
    const receiptEmail =
      user_details?.email && user_details.email.length > 0
        ? user_details.email
        : undefined;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "aud",

      // 🟢 KEY UPDATE: Enabling the "Big 3" for Guests (Card, Apple/Google Pay, Afterpay)
      automatic_payment_methods: { enabled: true },

      // 🟢 FIX: Only pass email if it exists
      receipt_email: receiptEmail,

      metadata: {
        sanityIds: idList,
        quantities: quantityList,
        // If guest, store "Guest" so we know in Sanity
        customerEmail: user_details?.email || "guest_pending",
        customerName: user_details?.name || "Guest",
        customerPhone: user_details?.phone || "",
        orderItems: JSON.stringify(orderItemsMinimal),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
