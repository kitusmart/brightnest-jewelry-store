import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "next-sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover" as any,
});

// Create the Sanity write client directly to avoid import path issues
const writeClient = createClient({
  projectId: "gzxol775",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  if (!signature) {
    return new NextResponse("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1. Fetch line items and expand the product to get metadata
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    try {
      // 2. Create the Order in Sanity using your exact schema fields
      const order = await writeClient.create({
        _type: "order",
        orderNumber: session.id.slice(-8).toUpperCase(),
        stripePaymentId: session.payment_intent as string,
        customerName: session.customer_details?.name || "Customer",
        email: session.customer_details?.email || "",
        total: session.amount_total ? session.amount_total / 100 : 0,
        status: "paid",
        createdAt: new Date().toISOString(),
        // Mapping items to match your orderType.ts array structure
        items: lineItems.data.map((item) => ({
          _key: item.id,
          product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product).metadata
              .sanityProductId,
          },
          quantity: item.quantity || 1,
          priceAtPurchase: item.amount_total / 100,
        })),
      });

      console.log(`✅ Success: Order created with ID ${order._id}`);

      // 3. Update Inventory for each item in the order
      for (const item of lineItems.data) {
        const product = item.price?.product as Stripe.Product;
        const sanityId = product.metadata.sanityProductId;

        if (sanityId) {
          await writeClient
            .patch(sanityId)
            .dec({ stock: item.quantity || 1 })
            .commit();
          console.log(`✅ Success: Stock updated for ${sanityId}`);
        }
      }
    } catch (error) {
      console.error("❌ Sanity Sync Error:", error);
      return new NextResponse("Sanity Update Failed", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
