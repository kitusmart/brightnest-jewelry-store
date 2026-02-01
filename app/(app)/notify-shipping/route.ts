import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, orderNumber } = body;

    if (!email || !orderNumber) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Fetch the latest data from Sanity
    const orderDetails = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId
      }`,
      { id: orderNumber },
    );

    // 2. SMART LOGIC: Check if we have a Tracking ID or not
    const hasTrackingId =
      orderDetails?.trackingId && orderDetails.trackingId.length > 3;

    // Scenario A: No ID yet (Order Confirmation)
    let finalTrackingId = "Preparing for dispatch...";
    let emailSubject = "Order Received: We are packing your jewelry! 💎";

    // Scenario B: We have an ID (Shipping Update)
    if (hasTrackingId) {
      finalTrackingId = orderDetails.trackingId;
      emailSubject = `Your Order Shipped! (Track: ${finalTrackingId}) 🚚`;
    }

    const name = orderDetails?.customerName || "Valued Customer";

    // 3. Render the Email
    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

    // 4. Send with the DYNAMIC Subject Line
    const { error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ message: "Email Sent" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
