import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const baseUrl = "https://elysia-luxe.vercel.app";

    // 1. PREPARE THE "PACKING SLIP" (CRITICAL FOR INVENTORY!)
    // This fixes the "Red Box" error in Sanity.
    const productIds = items.map((item: any) => ({
      _key: item._id,
      product: {
        _type: "reference",
        _ref: item._id,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
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
              sanityProductId: item._id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      submit_type: "pay",

      // 🟢 FIX 1: The "Packing Slip".
      // This tells Sanity EXACTLY which products to update.
      metadata: {
        productIds: JSON.stringify(productIds),
      },

      // 🟢 FIX 2: The "Receipt Number".
      // This fixes the "Securing Ref..." error on the website.
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
