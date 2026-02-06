import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const baseUrl = "https://elysia-luxe.vercel.app";

    // 🟢 FINAL TRIPLE-CHECK:
    // We check _id, id, and _ref. One of these MUST contain your Sanity ID.
    // This is why your Sanity order showed "No Items" before.
    const idList = items
      .map((item: any) => item._id || item.id || item._ref)
      .join(",");

    const quantityList = items.map((item: any) => item.quantity).join(",");

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
            // Ensure image is a valid string or empty
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      submit_type: "pay",
      metadata: {
        sanityIds: idList,
        quantities: quantityList,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
