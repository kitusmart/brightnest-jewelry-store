import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, customerName, orderNumber, trackingNumber } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // This converts the React component into a plain HTML string
    const emailHtml = await render(
      ShippingEmail({ customerName, orderNumber, trackingNumber })
    );

    const { data, error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: `Your Order ${orderNumber} has Shipped!`,
      html: emailHtml, // We use 'html' instead of 'react' for maximum stability
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Email Sent!" });
  } catch (error) {
    console.error("Final Crash Check:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}