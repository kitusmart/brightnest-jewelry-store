import ShippingEmail from "@/components/emails/ShippingEmail";
import * as React from "react"; // Added standard React import
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, customerName, orderNumber, trackingNumber } = body;

    // Trigger the email send using createElement for stability
    const { data, error } = await resend.emails.send({
      from: "Brightnest <onboarding@resend.dev>",
      to: [email],
      subject: `Order ${orderNumber} Shipped!`,
      react: React.createElement(ShippingEmail, { 
        customerName, 
        orderNumber, 
        trackingNumber 
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Manual Log - Crash Detail:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}