import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { client } from "@/sanity/lib/client"; // Ensure this path matches your project

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // We only trust the ID. We will fetch the rest to be safe.
    const { email, orderNumber } = body;

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "Missing email or order ID" },
        { status: 400 },
      );
    }

    // SENIOR FIX: Fetch the 'Truth' from Sanity directly
    const orderDetails = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId,
        "items": items[]{ title, price }
      }`,
      { id: orderNumber },
    );

    // If Sanity has a tracking ID, use it. Otherwise, fallback.
    const finalTrackingId = orderDetails?.trackingId || "Processing...";
    const name = orderDetails?.customerName || "Valued Customer";

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: finalTrackingId,
      }),
    );

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
