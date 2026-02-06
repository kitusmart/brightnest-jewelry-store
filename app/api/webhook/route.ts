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

  if (!sig)
    return NextResponse.json({ error: "No signature" }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret)
    return NextResponse.json({ error: "No Secret" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 🟢 1. UNPACK THE SHORT CODES
      const sanityIds = session.metadata?.sanityIds
        ? session.metadata.sanityIds.split(",")
        : [];

      const quantities = session.metadata?.quantities
        ? session.metadata.quantities.split(",").map(Number)
        : [];

      // 🟢 2. CREATE SANITY ITEMS
      const orderItems = sanityIds.map((id, index) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: id,
        },
        quantity: quantities[index] || 1,
      }));

      // 🟢 3. CREATE ORDER
      const order = await backendClient.create({
        _type: "order",
        orderNumber:
          session.metadata?.orderNumber ||
          `ORD-${session.id.slice(-6).toUpperCase()}`,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        customerName: session.customer_details?.name,
        stripeCustomerId: session.customer as string,
        email: session.customer_details?.email,
        currency: session.currency,
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
        items: orderItems,
        // 🟢 FIX: We use 'customer_details' to fix the red TypeScript errors.
        // This contains the exact same address data but TypeScript accepts it.
        shippingAddress: {
          line1: session.customer_details?.address?.line1,
          line2: session.customer_details?.address?.line2,
          city: session.customer_details?.address?.city,
          state: session.customer_details?.address?.state,
          postalCode: session.customer_details?.address?.postal_code,
          country: session.customer_details?.address?.country,
        },
      });

      console.log("Order created:", order._id);

      // 🟢 4. DECREASE INVENTORY
      for (const item of orderItems) {
        if (item.product._ref) {
          await backendClient
            .patch(item.product._ref)
            .dec({ quantity: item.quantity })
            .commit();
        }
      }

      // 🟢 5. SEND EMAIL
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
      }
    } catch (err: any) {
      console.error("Webhook Error:", err);
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
