import ShippingEmail from "@/components/emails/ShippingEmail";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      customerName,
      orderNumber,
      trackingNumber,
      status,
      courier,
      totalPrice,
      orderItems,
    } = body;

    // 🟢 Keep your existing status check
    if (status !== "shipped") {
      return NextResponse.json({
        message: "Ignoring confirmed status to prevent duplicate",
      });
    }

    // 🟢 THE FIX: We send a 'Success' response immediately to stop the double-firing
    const response = NextResponse.json({ message: "Processing Email" });

    // 🟢 Run the email sending in the background so it doesn't block the server
    (async () => {
      try {
        await resend.emails.send({
          from: "Elysia Luxe <onboarding@resend.dev>",
          to: [email],
          subject: `Your Luxury Pieces are on Their Way! (Order: ${orderNumber}) ⭐`,
          react: ShippingEmail({
            customerName: customerName || "Valued Customer",
            orderNumber: orderNumber,
            trackingNumber: trackingNumber || "Preparing for dispatch...",
            courier: courier || "Australia Post", // 🟢 Ensure courier is passed correctly
            totalPrice: totalPrice || 0,
            orderItems: orderItems || [],
          }),
        });
      } catch (e) {
        console.error("Background Email Error:", e);
      }
    })();

    return response; // 🟢 Immediate response stops the duplicate
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
