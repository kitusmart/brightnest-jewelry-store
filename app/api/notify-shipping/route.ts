import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Read Data (Now correctly mapped from Sanity)
    const { email, customerName, orderNumber, trackingNumber } = body;

    console.log("Webhook Payload:", body);

    // 2. Safety Check
    if (!email || !orderNumber) {
      console.log("Missing Email or Order ID. Check Sanity Projection.");
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // 3. Check for Tracking Number
    if (!trackingNumber || trackingNumber.length < 3) {
      console.log("No Tracking ID. Skipping.");
      return NextResponse.json({ message: "Skipped: No Tracking ID" });
    }

    // 4. Send Email
    const uniqueSubject = `Your Order Shipped! (Track: ${trackingNumber})`;
    const name = customerName || "Valued Customer";

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber,
      }),
    );

    const { error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: uniqueSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Sent Successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
