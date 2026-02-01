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

    // SENIOR FIX: usage of .withConfig({ useCdn: false })
    // This forces the code to ignore the cache and get the LIVE data immediately.
    const orderDetails = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId
      }`,
      { id: orderNumber },
    );

    console.log("Fetched Order Data:", orderDetails); // For debugging logs

    // Check if ID exists (length > 1 to be safe)
    const hasTrackingId =
      orderDetails?.trackingId && orderDetails.trackingId.length > 1;

    // Default: Order Confirmation
    let finalTrackingId = "Preparing for dispatch...";
    let emailSubject = "Order Received: We are packing your jewelry! 💎";

    // Override: Shipping Update
    if (hasTrackingId) {
      finalTrackingId = orderDetails.trackingId;
      emailSubject = `Your Order Shipped! (Track: ${finalTrackingId}) 🚚`;
    }

    const name = orderDetails?.customerName || "Valued Customer";

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

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
