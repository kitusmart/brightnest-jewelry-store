import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Raw Webhook Body:", JSON.stringify(body, null, 2));

    // 1. EXTRACT DATA (From Raw Sanity Document)
    // When Projection is empty, the body IS the document.
    const { email, customerName, _id, trackingId, trackingNumber } = body;

    // 2. FIND THE TRACKING ID (Check ALL possible names)
    // This solves the issue where the field might be named differently
    const finalTrackingId = trackingId || trackingNumber;
    const finalOrderNumber = _id;

    // 3. STRICT CHECK
    if (!finalTrackingId) {
      console.log(
        "Still no tracking ID found. Field names might be different.",
      );
      return NextResponse.json({ message: "Skipped: No Tracking ID found" });
    }

    // 4. PREPARE EMAIL
    const uniqueSubject = `Your Order Shipped! (Track: ${finalTrackingId})`;
    const name = customerName || "Valued Customer";

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber: finalOrderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

    // 5. SEND EMAIL
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

    return NextResponse.json({ message: "Shipping Email Sent Successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
