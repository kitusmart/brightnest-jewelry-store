import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const baseUrl = "https://elysia-luxe.vercel.app";

    // 1. PREPARE THE "PACKING SLIP" (This was missing!)
    // We create a clean list of IDs so the Webhook knows exactly what to save to Sanity.
    const productIds = items.map((item: any) => ({
      _key: item._id,
      product: {
        _type: "reference",
        _ref: item._id,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      // Payment Methods (Keep your manual list)
      payment_method_types: ["card", "afterpay_clearpay", "zip"],

      locale: "en",
      shipping_address_collection: {
        allowed_countries: ["AU"],
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
              // This is for Inventory Decrease
              sanityProductId: item._id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      submit_type: "pay",

      // 🟢 THE FIX: We put the Packing Slip back in!
      // Without this, Sanity shows the "Red Box" error.
      metadata: {
        productIds: JSON.stringify(productIds),
      },

      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
