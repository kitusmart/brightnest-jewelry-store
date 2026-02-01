import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // LOGIC: We accept the order ID and fetch the tracking number ourselves
    const { email, orderNumber } = body;

    if (!email || !orderNumber) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Fetch from Sanity
    const orderDetails = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId
      }`,
      { id: orderNumber },
    );

    // 2. Fallback Text (This proves the code is new)
    const finalTrackingId = orderDetails?.trackingId || "SYSTEM-CONNECTED";
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
      subject: "Order Dispatched (Update)",
      html: emailHtml,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ message: "Sent" });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
