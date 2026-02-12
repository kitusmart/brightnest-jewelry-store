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

  // 🟢 NEW: Listen for Payment Intent Success (Custom Mode)
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // 1. EXTRACT DATA FROM METADATA
      const sanityIds = paymentIntent.metadata?.sanityIds
        ? paymentIntent.metadata.sanityIds.split(",")
        : [];
      const quantities = paymentIntent.metadata?.quantities
        ? paymentIntent.metadata.quantities.split(",").map(Number)
        : [];

      const shipping = paymentIntent.shipping?.address;
      const shippingName =
        paymentIntent.shipping?.name || paymentIntent.metadata?.customerName;
      const customerEmail =
        paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail;
      const customerPhone =
        paymentIntent.shipping?.phone ||
        paymentIntent.metadata?.customerPhone ||
        "";

      const orderItems = sanityIds.map((id, index) => ({
        _key: crypto.randomUUID(),
        product: { _type: "reference", _ref: id },
        quantity: quantities[index] || 1,
      }));

      // 2. CREATE ORDER IN SANITY
      const order = await backendClient.create({
        _type: "order",
        orderNumber: `ORD-${paymentIntent.id.slice(-6).toUpperCase()}`,
        stripePaymentIntentId: paymentIntent.id,
        customerName: shippingName,
        email: customerEmail,
        customerPhone: customerPhone,
        currency: paymentIntent.currency,
        totalPrice: paymentIntent.amount ? paymentIntent.amount / 100 : 0,
        status: "paid",
        orderDate: new Date().toISOString(),
        items: orderItems,
        shippingAddress: {
          line1: shipping?.line1,
          line2: shipping?.line2,
          city: shipping?.city,
          state: shipping?.state,
          postalCode: shipping?.postal_code,
          country: shipping?.country,
        },
      });

      // 3. INVENTORY UPDATE (Kept your logic)
      for (const item of orderItems) {
        if (item.product._ref) {
          await backendClient
            .patch(item.product._ref)
            .dec({ stock: item.quantity })
            .commit();
        }
      }

      // 4. SEND EMAIL (Kept your logic)
      if (customerEmail) {
        const enrichedItems = await Promise.all(
          orderItems.map(async (item) => {
            const productData = await backendClient.fetch(
              `*[_id == $id][0]{name, "image": images[0].asset->url, price}`,
              { id: item.product._ref },
            );
            return {
              productName: productData?.name || "Luxury Piece",
              quantity: item.quantity,
              price: productData?.price || 0,
              image: productData?.image || "",
            };
          }),
        );

        await resend.emails.send({
          from: "Elysia Luxe <onboarding@resend.dev>",
          to: [customerEmail],
          subject: "Your Shine is Secured | Order Confirmation",
          react: ShippingEmail({
            customerName: shippingName || "Valued Customer",
            orderNumber: order.orderNumber,
            trackingNumber: "Preparing for dispatch...",
            totalPrice: paymentIntent.amount ? paymentIntent.amount / 100 : 0,
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
