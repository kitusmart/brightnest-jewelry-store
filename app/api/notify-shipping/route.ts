import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🟢 Updated Extraction: Get the new fields from the Sanity Webhook
    const {
      email,
      customerName,
      orderNumber,
      trackingNumber,
      status,
      courier, // Re-mapped from shippingPartner in Sanity
      totalPrice, // 🟢 NEW
      orderItems, // 🟢 NEW (The array of products)
    } = body;

    console.log("Full Webhook Data:", JSON.stringify(body, null, 2));

    // Only send the email if the status is "shipped"
    if (status !== "shipped")
      return NextResponse.json({ message: "Not shipped" });

    const { error } = await resend.emails.send({
      from: "Elysia Luxe <onboarding@resend.dev>",
      to: [email],
      subject: `Your Luxury Pieces are on Their Way! (Order: ${orderNumber}) ⭐`,
      react: ShippingEmail({
        customerName: customerName || "Valued Customer",
        orderNumber: orderNumber,
        trackingNumber: trackingNumber || "TBA",
        courier: courier || "Australia Post",
        totalPrice: totalPrice || 0, // 🟢 Pass to template
        orderItems: orderItems || [], // 🟢 Pass to template
      }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ message: "Email Sent" });
  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
