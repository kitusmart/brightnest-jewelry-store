import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

// Note: We removed the Sanity Client import. We trust the Webhook data directly.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // LOGGING: This will show up in Vercel logs so you can see exactly what Sanity sent
    console.log("Webhook Payload Received:", JSON.stringify(body, null, 2));

    // 1. Read Data DIRECTLY from the Webhook
    // Your Webhook Projection sends: email, customerName, orderNumber, trackingNumber
    const { email, customerName, orderNumber, trackingNumber } = body;

    // 2. Safety Check
    if (!email || !orderNumber) {
      console.error("Missing email or orderNumber in payload");
      return NextResponse.json(
        { message: "Missing essential data" },
        { status: 400 },
      );
    }

    // 3. STRICT CHECK: Is there a Tracking ID in the payload?
    // We check trackingNumber because that is what your Webhook Projection sends.
    if (!trackingNumber || trackingNumber.length < 3) {
      console.log("No Tracking ID in payload. Skipping email.");
      return NextResponse.json({
        message: "Skipped: No Tracking ID provided in payload",
      });
    }

    // 4. Send the Email
    // Unique subject to prevent Resend spam blocking
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

    return NextResponse.json({ message: "Sent Successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
