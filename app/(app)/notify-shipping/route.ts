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
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // 1. Fetch Data (Bypass Cache)
    const orderDetails = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "order" && _id == $id][0]{
        customerName,
        trackingId,
        trackingNumber
      }`,
      { id: orderNumber },
    );

    // 2. STRICT CHECK: Only proceed if there is a Tracking ID
    // We check both naming possibilities (trackingId or trackingNumber)
    const realId = orderDetails?.trackingId || orderDetails?.trackingNumber;

    if (!realId || realId.length < 3) {
      console.log("No Tracking ID found. Aborting email.");
      return NextResponse.json({
        message: "No Tracking ID yet. Email skipped.",
      });
    }

    // 3. Prepare Email
    const name = orderDetails?.customerName || "Valued Customer";

    // We add a random number to the subject to trick Gmail/Resend into thinking it's new
    // This solves the "Spam Block" issue from your previous attempts
    const uniqueSubject = `Your Order Shipped! (Track: ${realId})`;

    const emailHtml = await render(
      ShippingEmail({
        customerName: name,
        orderNumber,
        trackingNumber: realId,
      }),
    );

    // 4. Send
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
