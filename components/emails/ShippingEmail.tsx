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
}

export default function ShippingEmail({
  customerName,
  orderNumber,
  trackingNumber,
}: ShippingEmailProps) {
  // LOGIC: Check if the order is actually shipped or just confirmed
  const isShipped =
    trackingNumber && trackingNumber !== "Preparing for dispatch...";

  return (
    <Html>
      <Head />
      <Preview>
        {isShipped
          ? "Your Brightnest Jewelry is on its way!"
          : "Order Confirmation - Brightnest Jewelry"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- BRAND HEADER (Midnight Blue) --- */}
          <Section style={header}>
            <Heading style={brandText}>BRIGHTNEST</Heading>
            <Text style={tagline}>ELEVATE YOUR SHINE</Text>
          </Section>

          {/* --- MAIN CONTENT --- */}
          <Section style={content}>
            {/* DYNAMIC TITLE */}
            <Heading style={h1}>
              {isShipped ? "Order Dispatched" : "Order Confirmed"}
            </Heading>

            <Text style={text}>
              Hello <strong>{customerName}</strong>,
            </Text>

            {/* DYNAMIC BODY TEXT */}
            <Text style={text}>
              {isShipped
                ? "Great news! Your luxury pieces have been carefully packed and are now on their way to you."
                : "Thank you for choosing Brightnest. We have successfully received your payment and are getting your order ready. You will receive another email as soon as it ships."}
            </Text>

            {/* --- GOLD TRACKING BOX --- */}
            <Section style={trackingBox}>
              <Text style={trackingLabel}>
                {isShipped ? "TRACKING NUMBER" : "STATUS"}
              </Text>
              <Text style={trackingId}>{trackingNumber}</Text>
            </Section>

            {/* Show tracking instructions only if shipped */}
            {isShipped && (
              <Text style={text}>
                You can track your package using the ID above. Please allow 24
                hours for the courier to update the status.
              </Text>
            )}

            {/* --- ACTION BUTTON (Only show if shipped) --- */}
            {isShipped && (
              <Section style={btnContainer}>
                <Button
                  style={button}
                  href={`https://www.google.com/search?q=${trackingNumber}`}
                >
                  Track Your Order
                </Button>
              </Section>
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

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "5px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
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
  letterSpacing: "2px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
};

const tagline = {
  color: "#ffffff",
  margin: "5px 0 0",
  fontSize: "10px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  opacity: 0.8,
};

const content = {
  padding: "40px 40px",
};

const h1 = {
  color: "#1B2A4E",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
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
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "0 0 5px",
};

const trackingId = {
  color: "#1B2A4E",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "1px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#1B2A4E",
  color: "#ffffff",
  padding: "12px 30px",
  borderRadius: "4px",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
