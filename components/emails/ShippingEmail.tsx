import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface ShippingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  courier?: string; // 🟢 Matches your Sanity field name
}

export default function ShippingEmail({
  customerName,
  orderNumber,
  trackingNumber,
  courier = "Australia Post", // 🟢 Fallback if Sanity field is empty
}: ShippingEmailProps) {
  const isShipped =
    trackingNumber && trackingNumber !== "Preparing for dispatch...";

  // 🟢 Dynamic Tracking Logic
  const getTrackingUrl = (partnerName: string, trackingNum: string) => {
    const name = partnerName?.toLowerCase() || "";
    if (name.includes("post"))
      return `https://auspost.com.au/mypost/track/#/details/${trackingNum}`;
    if (name.includes("star"))
      return `https://startrack.com.au/track/details?id=${trackingNum}`;
    if (name.includes("please"))
      return `https://www.couriersplease.com.au/tools-track/tracking-results?id=${trackingNum}`;
    if (name.includes("aramex"))
      return `https://www.aramex.com.au/tools/track?l=${trackingNum}`;

    return `https://www.google.com/search?q=${trackingNum}`; // Final fallback
  };

  const trackingUrl = getTrackingUrl(courier, trackingNumber);

  return (
    <Html>
      <Head />
      <Preview>
        {isShipped
          ? "Your Elysia Luxe Jewelry is on its way!"
          : "Order Confirmation"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* BRAND HEADER */}
          <Section style={header}>
            <Heading style={brandText}>ELYSIA LUXE</Heading>
            <Text style={tagline}>FOREVER DEFINED</Text>
          </Section>

          {/* MAIN CONTENT */}
          <Section style={content}>
            <Heading style={h1}>
              {isShipped ? "Order Dispatched" : "Order Confirmed"}
            </Heading>
            <Text style={text}>
              Hello <strong>{customerName}</strong>,
            </Text>
            <Text style={text}>
              {isShipped
                ? "Great news! Your luxury pieces have been carefully packed and are now on their way to you."
                : "Thank you for choosing Elysia Luxe. We are getting your order ready."}
            </Text>

            {/* GOLD TRACKING BOX */}
            <Section style={trackingBox}>
              <Text style={trackingLabel}>
                {isShipped ? `${courier.toUpperCase()} TRACKING` : "STATUS"}
              </Text>
              <Text style={trackingId}>{trackingNumber}</Text>
            </Section>

            {isShipped && (
              <>
                <Text style={text}>
                  You can track your package using the button below. Please
                  allow 24 hours for the status to update.
                </Text>
                <Section style={btnContainer}>
                  <Button style={button} href={trackingUrl}>
                    Track Your Order
                  </Button>
                </Section>
              </>
            )}

            <Hr style={hr} />
            <Text style={footer}>
              Order ID: {orderNumber} <br />
              Need help? Reply directly to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- LUXURY STYLES ---
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "5px",
  overflow: "hidden",
};
const header = {
  backgroundColor: "#1B2A4E",
  padding: "30px 20px",
  textAlign: "center" as const,
};
const brandText = {
  color: "#D4AF37",
  margin: "0",
  fontSize: "28px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
};
const tagline = {
  color: "#ffffff",
  margin: "5px 0 0",
  fontSize: "10px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
};
const content = { padding: "40px 40px" };
const h1 = { color: "#1B2A4E", fontSize: "24px", textAlign: "center" as const };
const text = {
  color: "#525f7f",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};
const trackingBox = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  border: "1px dashed #D4AF37",
  textAlign: "center" as const,
  margin: "25px 0",
};
const trackingLabel = {
  color: "#8898aa",
  fontSize: "11px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
};
const trackingId = { color: "#1B2A4E", fontSize: "20px", fontWeight: "bold" };
const btnContainer = { textAlign: "center" as const, margin: "30px 0" };
const button = {
  backgroundColor: "#D4AF37",
  color: "#ffffff",
  padding: "12px 30px",
  borderRadius: "4px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "11px",
  textAlign: "center" as const,
};
