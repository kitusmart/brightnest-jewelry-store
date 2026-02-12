import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items, user_details } = await request.json();

    const amount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0,
    );

    // 🟢 1. Prepare Data for the Webhook (Sanity Orders)
    const idList = items
      .map((item: any) => item.productId || item._id || item.id)
      .join(",");
    const quantityList = items.map((item: any) => item.quantity).join(",");

    // 🟢 2. Prepare Data for the Success Page (Visuals)
    // We create a lightweight version of the items to fit inside Stripe's metadata limit
    const orderItemsMinimal = items.map((item: any) => ({
      productName: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      // We skip the image URL here to save space (Stripe metadata has a 500-char limit)
      // The Success Page will show Name/Price/Qty perfectly.
    }));

    // 🟢 CLEAN MODE: paymentIntents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "aud",
      automatic_payment_methods: { enabled: true },

      // 🟢 FIX 1: Pass the email directly to Stripe so it sends its own receipt too
      receipt_email: user_details?.email,

      metadata: {
        sanityIds: idList,
        quantities: quantityList,
        customerEmail: user_details?.email || "guest",
        customerName: user_details?.name || "Guest",
        // 🟢 FIX 2: The "Bridge" - JSON stringify the items so Success Page can read them
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
