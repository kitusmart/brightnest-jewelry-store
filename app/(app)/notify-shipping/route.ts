import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // We expect the Order ID, not the tracking number
    const { email, orderNumber } = body;

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "Missing email or order ID" },
        { status: 400 },
      );
    }

    // 1. Fetch the REAL data from Sanity
    const orderDetails = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId,
        "items": items[]{ title, price }
      }`,
      { id: orderNumber },
    );

    // 2. Use the ID from Sanity, or fallback to a noticeable text
    const finalTrackingId = orderDetails?.trackingId || "CHECK-SANITY-DATA";
    const name = orderDetails?.customerName || "Valued Customer";

    // 3. Render the Email
    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

    // 4. Send it
    const { data, error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: `Your Order has Shipped! 💎`,
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
