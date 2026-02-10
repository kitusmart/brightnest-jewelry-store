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
      const sanityIds = session.metadata?.sanityIds
        ? session.metadata.sanityIds.split(",")
        : [];
      const quantities = session.metadata?.quantities
        ? session.metadata.quantities.split(",").map(Number)
        : [];

      // 1. Basic Order Items (for Inventory & Order Doc)
      const orderItems = sanityIds.map((id, index) => ({
        _key: crypto.randomUUID(),
        product: { _type: "reference", _ref: id },
        quantity: quantities[index] || 1,
      }));

      // 2. Create Order in Sanity
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
        shippingAddress: {
          line1: session.customer_details?.address?.line1,
          line2: session.customer_details?.address?.line2,
          city: session.customer_details?.address?.city,
          state: session.customer_details?.address?.state,
          postalCode: session.customer_details?.address?.postal_code,
          country: session.customer_details?.address?.country,
        },
      });

      // 🟢 FIX 1: INVENTORY UPDATE (Safely)
      for (const item of orderItems) {
        if (item.product._ref) {
          try {
            await backendClient
              .patch(item.product._ref)
              .dec({ stock: item.quantity }) // Ensure 'stock' matches your schema field
              .commit();
          } catch (invErr) {
            console.error(
              "Inventory Update Failed for:",
              item.product._ref,
              invErr,
            );
          }
        }
      }

      // 🟢 FIX 2: SEND EMAIL (With Real Data)
      if (session.customer_details?.email) {
        // A. Fetch Product Details (Name & Image) from Sanity
        // We need this because Stripe only gave us IDs, but the Email needs Names/Images.
        const enrichedItems = await Promise.all(
          orderItems.map(async (item) => {
            const productData = await backendClient.fetch(
              `*[_id == $id][0]{
                  name, 
                  "image": images[0].asset->url,
                  price
                }`,
              { id: item.product._ref },
            );
            return {
              productName: productData?.name || "Luxury Piece",
              quantity: item.quantity,
              price: productData?.price || 0,
              image: productData?.image || "", // Passes the image URL
            };
          }),
        );

        // B. Send the Email with the enriched data
        await resend.emails.send({
          from: "Elysia Luxe <onboarding@resend.dev>",
          to: [session.customer_details.email],
          subject: "Your Shine is Secured | Order Confirmation",
          react: ShippingEmail({
            customerName: session.customer_details.name || "Valued Customer",
            orderNumber: order.orderNumber,
            trackingNumber: "Preparing for dispatch...",
            // 🟢 PASS THE MISSING DATA HERE:
            totalPrice: session.amount_total ? session.amount_total / 100 : 0,
            orderItems: enrichedItems,
          }),
        });
      }
    } catch (err: any) {
      console.error("Webhook Logic Error:", err);
      return NextResponse.json({ error: "Logic Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
