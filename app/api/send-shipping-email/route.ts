import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, customerName, orderNumber, trackingNumber } = body;

    // Log the data to Vercel so we can see what Sanity is actually sending
    console.log("Webhook Data Received:", body);

    if (!email) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: `Your Brightnest Order ${orderNumber} has Shipped!`,
      react: ShippingEmail({ customerName, orderNumber, trackingNumber }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}