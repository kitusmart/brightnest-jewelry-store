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
  return (
    <Html>
      <Head />
      <Preview>Your Brightnest Jewelry is on its way!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* --- BRAND HEADER (Midnight Blue) --- */}
          <Section style={header}>
            <Heading style={brandText}>BRIGHTNEST</Heading>
            <Text style={tagline}>ELEVATE YOUR SHINE</Text>
          </Section>

          {/* --- MAIN CONTENT --- */}
          <Section style={content}>
            <Heading style={h1}>Order Dispatched</Heading>
            <Text style={text}>
              Hello <strong>{customerName}</strong>,
            </Text>
            <Text style={text}>
              Great news! Your luxury pieces have been carefully packed and are
              now on their way to you.
            </Text>

            {/* --- GOLD TRACKING BOX --- */}
            <Section style={trackingBox}>
              <Text style={trackingLabel}>TRACKING NUMBER</Text>
              <Text style={trackingId}>{trackingNumber}</Text>
            </Section>

            <Text style={text}>
              You can track your package using the ID above. Please allow 24
              hours for the courier to update the status.
            </Text>

            {/* --- ACTION BUTTON --- */}
            <Section style={btnContainer}>
              <Button
                style={button}
                href={`https://www.google.com/search?q=${trackingNumber}`}
              >
                Track Your Order
              </Button>
            </Section>

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
  overflow: "hidden", // Keeps the blue header inside the rounded corners
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const header = {
  backgroundColor: "#1B2A4E", // Midnight Blue Background
  padding: "30px 20px",
  textAlign: "center" as const,
};

const brandText = {
  color: "#D4AF37", // Gold Text
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
  border: "1px dashed #D4AF37", // Gold dashed border for emphasis
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
  backgroundColor: "#1B2A4E", // Midnight Blue Button
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
