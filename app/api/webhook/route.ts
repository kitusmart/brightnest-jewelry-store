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
    metadata,
    payment_intent,
    customer_details,
    total_details,
  } = session;

  // Retrieve expanded line items to get product metadata
  const { line_items } = await stripe.checkout.sessions.retrieve(id, {
    expand: ["line_items.data.price.product"],
  });

  const orderItems = line_items?.data?.map((item) => {
    const product = item.price?.product as Stripe.Product;
    return {
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: product?.metadata?.sanityProductId, // Ensure this matches your metadata key
      },
      quantity: item.quantity,
    };
  });

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
    status: "pending",
    orderDate: new Date().toISOString(),
    items: orderItems,
    // Note: If you add shippingAddress to your schema,
    // you would map customer_details.address here.
  });

  return order;
}
