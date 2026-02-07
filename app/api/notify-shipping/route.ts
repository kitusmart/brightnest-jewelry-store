import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Read Data (Included 'status' to ensure we only mail when it's SHIPPED)
    const { email, customerName, orderNumber, trackingNumber, status } = body;

    console.log("Webhook Payload Received:", orderNumber, status);

    // 2. Safety Check: Only proceed if status is 'shipped'
    if (status !== "shipped") {
      console.log("Order is not shipped yet. Status:", status);
      return NextResponse.json({ message: "Skipped: Not shipped status" });
    }

    if (!email || !orderNumber) {
      console.log("Missing Email or Order ID.");
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // 3. Send Email using the React component directly (Cleaner)
    const { error } = await resend.emails.send({
      from: "Elysia Luxe <onboarding@resend.dev>",
      to: [email],
      subject: `Your Luxury Pieces are on Their Way! (Order: ${orderNumber})`,
      react: ShippingEmail({
        customerName: customerName || "Valued Customer",
        orderNumber: orderNumber,
        trackingNumber: trackingNumber || "TBA",
      }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Shipping Email Sent Successfully" });
  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
