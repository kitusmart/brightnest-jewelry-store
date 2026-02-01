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

    // 1. Fetch BOTH potential field names to be 100% safe
    // usage of .withConfig({ useCdn: false }) prevents stale data
    const orderDetails = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId,
        trackingNumber
      }`,
      { id: orderNumber },
    );

    console.log("Sanity Data:", orderDetails);

    // 2. Find the Real ID (Check both fields)
    const realTrackingId =
      orderDetails?.trackingId || orderDetails?.trackingNumber || "";
    const hasTrackingId = realTrackingId.length > 2;

    // Scenario A: No ID yet
    let finalTrackingId = "Preparing for dispatch...";
    let emailSubject = `Order Received! #${orderNumber.slice(-4)}`; // Unique Subject

    // Scenario B: Has ID (Shipping Update)
    if (hasTrackingId) {
      finalTrackingId = realTrackingId;
      emailSubject = `Shipped! Track #${finalTrackingId}`; // Unique Subject
    }

    const name = orderDetails?.customerName || "Valued Customer";

    // 3. Render
    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

    // 4. Send (With Unique Subject to prevent blocking)
    const { error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email Sent" });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
