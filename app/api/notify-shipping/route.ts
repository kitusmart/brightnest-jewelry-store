import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🟢 Gatekeeper to prevent duplicate emails from rapid Sanity clicks
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

    // 1. Only process if status is exactly "shipped"
    if (status !== "shipped") {
      return NextResponse.json({ message: "Ignoring non-shipped status" });
    }

    // 2. DEDUPLICATION: Stop duplicates if sent within the last 15 seconds
    const now = Date.now();
    const lastSent = sentOrders.get(orderNumber);
    if (lastSent && now - lastSent < 15000) {
      return NextResponse.json({ message: "Duplicate request blocked" });
    }
    sentOrders.set(orderNumber, now);

    // 3. SEND EMAIL (Using direct await for Vercel stability)
    try {
      if (!email) {
        throw new Error("No customer email provided in webhook payload");
      }

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

      return NextResponse.json({ message: "Shipping email sent successfully" });
    } catch (emailError: any) {
      console.error("Resend Error:", emailError);
      return NextResponse.json(
        { error: "Email delivery failed" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
