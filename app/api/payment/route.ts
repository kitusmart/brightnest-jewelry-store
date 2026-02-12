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

    // 🟢 FIX: Including 'image' for the Success Page visuals
    const orderItemsMinimal = items.map((item: any) => ({
      productName: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || "",
    }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      receipt_email: user_details?.email,

      metadata: {
        sanityIds: idList,
        quantities: quantityList,
        customerEmail: user_details?.email || "guest",
        customerName: user_details?.name || "Guest",
        // 🟢 FIX: Passing the Phone Number to the "Bridge"
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
