import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🟢 NEW: "Gatekeeper" to remember recently sent orders
const sentOrders = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      customerName,
      orderNumber,
      trackingNumber,
      status,
      courier,
      totalPrice,
      orderItems,
    } = body;

    if (status !== "shipped") {
      return NextResponse.json({ message: "Ignoring non-shipped status" });
    }

    // 🟢 DEDUPLICATION LOGIC: If we sent this order in the last 10 seconds, STOP.
    const now = Date.now();
    const lastSent = sentOrders.get(orderNumber);
    if (lastSent && now - lastSent < 10000) {
      return NextResponse.json({ message: "Duplicate request blocked" });
    }
    sentOrders.set(orderNumber, now);

    const response = NextResponse.json({ message: "Processing Email" });

    (async () => {
      try {
        await resend.emails.send({
          from: "Elysia Luxe <onboarding@resend.dev>",
          to: [email],
          subject: `Your Luxury Pieces are on Their Way! (Order: ${orderNumber}) ⭐`,
          react: ShippingEmail({
            customerName: customerName || "Valued Customer",
            orderNumber: orderNumber,
            trackingNumber: trackingNumber || "Preparing for dispatch...",
            courier: courier || "Australia Post",
            totalPrice: totalPrice || 0,
            orderItems: orderItems || [],
          }),
        });
      } catch (e) {
        console.error("Background Email Error:", e);
      }
    })();

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
