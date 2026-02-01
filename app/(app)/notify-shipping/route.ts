import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Read Data DIRECTLY from Webhook (Fastest method)
    const { email, customerName, orderNumber, trackingNumber } = body;

    console.log("Shipping Webhook Data:", body);

    if (!email || !orderNumber) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // 2. STRICT CHECK: Only send if Tracking ID exists
    // This effectively blocks any "duplicate" empty emails
    if (!trackingNumber || trackingNumber.length < 3) {
      console.log("No Tracking ID. Skipping email.");
      return NextResponse.json({ message: "Skipped: No Tracking ID" });
    }

    // 3. Send Email #2 (Shipping Update)
    // We use a specific subject line so Resend knows it's a new email
    const uniqueSubject = `Your Order Shipped! (Track: ${trackingNumber})`;
    const name = customerName || "Valued Customer";

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: trackingNumber,
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

    return NextResponse.json({ message: "Shipping Email Sent" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
