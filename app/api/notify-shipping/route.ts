import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🟢 STEP 1: Extract 'courier' from the body
    const {
      email,
      customerName,
      orderNumber,
      trackingNumber,
      status,
      courier,
    } = body;

    // 🟢 STEP 2: Log it (using 'courier')
    console.log("Webhook Received:", orderNumber, status, courier);

    if (status !== "shipped")
      return NextResponse.json({ message: "Not shipped" });

    const { error } = await resend.emails.send({
      from: "Elysia Luxe <onboarding@resend.dev>",
      to: [email],
      subject: `Your Luxury Pieces are on Their Way! ⭐`,
      react: ShippingEmail({
        customerName: customerName || "Valued Customer",
        orderNumber: orderNumber,
        trackingNumber: trackingNumber || "TBA",
        // 🟢 STEP 3: Pass 'courier' to the email
        courier: courier || "Australia Post",
      }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ message: "Email Sent" });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
