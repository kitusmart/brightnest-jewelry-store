import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // 🟢 Allows both "shipped" and "confirmed" status
    if (status !== "shipped") {
      return NextResponse.json({
        message: "Ignoring confirmed status to prevent duplicate",
      });
    }

    const { error } = await resend.emails.send({
      from: "Elysia Luxe <onboarding@resend.dev>",
      to: [email],
      // 🟢 Dynamic subject line based on status
      subject:
        status === "shipped"
          ? `Your Luxury Pieces are on Their Way! (Order: ${orderNumber}) ⭐`
          : `Order Confirmed: ${orderNumber} ⭐`,
      react: ShippingEmail({
        customerName: customerName || "Valued Customer",
        orderNumber: orderNumber,
        trackingNumber: trackingNumber || "Preparing for dispatch...",
        courier: courier || "Australia Post",
        totalPrice: totalPrice || 0,
        orderItems: orderItems || [],
      }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ message: "Email Sent" });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
