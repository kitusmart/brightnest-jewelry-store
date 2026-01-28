import { ShippingEmail } from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, customerName, orderNumber, trackingNumber } =
      await req.json();

    const { data, error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>", // You can use your own domain later
      to: [email],
      subject: `Your Brightnest Order ${orderNumber} has Shipped!`,
      react: ShippingEmail({ customerName, orderNumber, trackingNumber }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
