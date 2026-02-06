import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import Stripe from "stripe";
import { Resend } from "resend";
import ShippingEmail from "@/components/emails/ShippingEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      console.log("Order created in Sanity:", order._id);

      // AUTOMATED EMAIL: Fire receipt immediately
      if (session.customer_details?.email) {
        await resend.emails.send({
          from: "Elysia Luxe <onboarding@resend.dev>",
          to: [session.customer_details.email],
          subject: "Your Shine is Secured | Order Confirmation",
          react: ShippingEmail({
            customerName: session.customer_details.name || "Valued Customer",
            orderNumber: order.orderNumber,
            trackingNumber: "Preparing for dispatch...",
          }),
        });
        console.log(
          "Confirmation email sent to:",
          session.customer_details.email,
        );
      }
    } catch (err: any) {
      console.error("Error in webhook processing:", err);
      return NextResponse.json(
        { error: "Error processing webhook" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    payment_intent,
    customer_details,
    total_details,
    metadata, // 🟢 WE GRAB THE METADATA (YOUR PACKING SLIP)
  } = session;

  // 🟢 SAFETY FIX: We stop guessing. We use the data YOU sent.
  // This parses the list of IDs directly from the metadata.
  // NO MORE "RED BOX" because this data comes from your cart, not Stripe's internal database.
  const packedProductIds = metadata?.productIds
    ? JSON.parse(metadata.productIds)
    : [];

  // Use the packed data to build the Sanity items
  const orderItems = packedProductIds.map((item: any) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: item.product._ref, // 🟢 DIRECT ID. No lookups required.
    },
    quantity: item.quantity || 1,
  }));

  const order = await backendClient.create({
    _type: "order",
    orderNumber: id,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent as string,
    customerName: customer_details?.name,
    stripeCustomerId: session.customer as string,
    email: customer_details?.email,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    items: orderItems, // We use our safe list
    shippingAddress: {
      city: customer_details?.address?.city,
      country: customer_details?.address?.country,
      line1: customer_details?.address?.line1,
      line2: customer_details?.address?.line2,
      postalCode: customer_details?.address?.postal_code,
      state: customer_details?.address?.state,
    },
  });

  // Decrease Inventory
  if (orderItems) {
    for (const item of orderItems) {
      if (item.product._ref) {
        await backendClient
          .patch(item.product._ref)
          .dec({ quantity: item.quantity ?? 1 })
          .commit();

        console.log(`Stock updated for product: ${item.product._ref}`);
      }
    }
  }

  return order;
}
