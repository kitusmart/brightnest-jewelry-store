import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import Stripe from "stripe";

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
    } catch (err: any) {
      console.error("Error creating order in Sanity:", err);
      return NextResponse.json(
        { error: "Error creating order" },
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
  } = session;

  const { line_items } = await stripe.checkout.sessions.retrieve(id, {
    expand: ["line_items.data.price.product"],
  });

  const orderItems = line_items?.data?.map((item) => {
    const product = item.price?.product as Stripe.Product;
    return {
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        // Ensure you have "sanityProductId" set in your Stripe Product metadata
        _ref: product?.metadata?.sanityProductId,
      },
      quantity: item.quantity,
    };
  });

  // 1. Create the Order Document
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
    status: "paid", // Changed from pending to paid since this is a successful webhook
    orderDate: new Date().toISOString(),
    items: orderItems,
    shippingAddress: {
      city: customer_details?.address?.city,
      country: customer_details?.address?.country,
      line1: customer_details?.address?.line1,
      line2: customer_details?.address?.line2,
      postalCode: customer_details?.address?.postal_code,
      state: customer_details?.address?.state,
    },
  });

  // 2. STOCK AUTOMATION: Decrement the inventory in Sanity
  if (orderItems) {
    for (const item of orderItems) {
      if (item.product._ref) {
        await backendClient
          .patch(item.product._ref)
          .dec({ stock: item.quantity ?? 1 }) // Subtract the purchased quantity
          .commit();

        console.log(`Stock updated for product: ${item.product._ref}`);
      }
    }
  }

  return order;
}
