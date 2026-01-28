import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      locale: "en",

      // 🟢 NEW: Force Stripe to collect Shipping Address
      shipping_address_collection: {
        allowed_countries: ["AU", "US", "GB", "CA", "IN"], // Add any countries you ship to
      },

      // 🟢 NEW: Collect Phone Number (Important for Delivery)
      phone_number_collection: {
        enabled: true,
      },

      line_items: items.map((item: any) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              sanityProductId: item._id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      mode: "payment",
      submit_type: "pay",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Updated to pass session_id if needed later
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
