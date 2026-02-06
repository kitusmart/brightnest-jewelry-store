import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // 🟢 ABSOLUTE HARDCODED URL
    const baseUrl = "https://elysia-luxe.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      locale: "en",
      shipping_address_collection: {
        allowed_countries: ["AU", "US", "GB", "CA", "IN"],
      },
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
      // 🟢 Pointing to the new URL
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
