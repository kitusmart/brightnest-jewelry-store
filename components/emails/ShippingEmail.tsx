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
  Img,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  courier?: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

export default function ShippingEmail({
  customerName,
  orderNumber,
  trackingNumber,
  courier = "Australia Post",
  totalPrice = 0,
  orderItems = [],
}: ShippingEmailProps) {
  const isShipped =
    trackingNumber && trackingNumber !== "Preparing for dispatch...";

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
    return `https://www.google.com/search?q=${trackingNum}`;
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
          <Section style={header}>
            <Heading style={brandText}>ELYSIA LUXE</Heading>
            <Text style={tagline}>FOREVER DEFINED</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>
              {isShipped ? "Order Dispatched" : "Order Confirmed"}
            </Heading>
            <Text style={text}>
              Hello <strong>{customerName}</strong>,
            </Text>
            <Text style={text}>
              {isShipped
                ? "Great news! Your luxury pieces have been carefully packed and are now on their way."
                : "We are getting your order ready."}
            </Text>

            {/* ITEMS ORDERED SECTION WITH WHATSAPP */}
            <Section style={itemsContainer}>
              <Section style={itemHeaderRow}>
                <Text style={sectionTitle}>Items Ordered</Text>
                <Button
                  href="https://wa.me/YOUR_PHONE_NUMBER"
                  style={whatsappLink}
                >
                  Chat on WhatsApp
                </Button>
              </Section>

              {orderItems.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Section style={imageColumn}>
                    <Img
                      src={item.image}
                      width="80"
                      height="80"
                      alt={item.productName}
                      style={productImg}
                    />
                  </Section>
                  <Section style={detailsColumn}>
                    <Text style={productNameText}>{item.productName}</Text>
                    <Text style={productQuantity}>
                      Quantity: {item.quantity}
                    </Text>
                    <Text style={productPriceText}>${item.price}</Text>
                  </Section>
                </Section>
              ))}
            </Section>

            {/* ORDER SUMMARY */}
            <Section style={summaryBox}>
              <Hr style={summaryHr} />
              <Text style={summaryText}>
                Total Paid: <strong style={goldPrice}>${totalPrice}</strong>
              </Text>
            </Section>

            {/* TRACKING BOX */}
            <Section style={trackingBox}>
              <Text style={trackingLabel}>
                {isShipped ? `${courier.toUpperCase()} TRACKING` : "STATUS"}
              </Text>
              <Text style={trackingId}>{trackingNumber}</Text>
            </Section>

            {isShipped && (
              <Section style={btnContainer}>
                <Button style={button} href={trackingUrl}>
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

const main = {
  backgroundColor: "#f4f7f9",
  fontFamily: "sans-serif",
  padding: "40px 0",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};
const header = {
  backgroundColor: "#1B2A4E",
  padding: "30px 20px",
  textAlign: "center" as const,
};
const brandText = {
  color: "#D4AF37",
  fontSize: "28px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
};
const tagline = {
  color: "#ffffff",
  fontSize: "10px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
};
const content = { padding: "40px" };
const h1 = { color: "#1B2A4E", fontSize: "24px", textAlign: "center" as const };
const text = {
  color: "#525f7f",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center" as const,
};

const itemsContainer = {
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};
const itemHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};
const sectionTitle = {
  display: "table-cell",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1B2A4E",
};
const whatsappLink = {
  display: "table-cell",
  textAlign: "right" as const,
  fontSize: "12px",
  color: "#25D366",
  textDecoration: "none",
  fontWeight: "bold",
};

const itemRow = { display: "table", width: "100%", marginBottom: "15px" };
const imageColumn = {
  display: "table-cell",
  width: "80px",
  verticalAlign: "top",
};
const productImg = { borderRadius: "4px", border: "1px solid #f0f0f0" };
const detailsColumn = {
  display: "table-cell",
  paddingLeft: "15px",
  textAlign: "left" as const,
};
const productNameText = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1B2A4E",
  margin: "0",
};
const productQuantity = { fontSize: "12px", color: "#8898aa" };
const productPriceText = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1B2A4E",
};

const summaryBox = { textAlign: "right" as const };
const summaryHr = { borderColor: "#e6ebf1", margin: "10px 0" };
const summaryText = { fontSize: "16px", color: "#1B2A4E" };
const goldPrice = { color: "#D4AF37" };

const trackingBox = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  border: "1px dashed #D4AF37",
  textAlign: "center" as const,
  margin: "20px 0",
};
const trackingLabel = {
  color: "#8898aa",
  fontSize: "11px",
  fontWeight: "bold",
};
const trackingId = { color: "#1B2A4E", fontSize: "20px", fontWeight: "bold" };
const btnContainer = { textAlign: "center" as const, margin: "20px 0" };
const button = {
  backgroundColor: "#D4AF37",
  color: "#ffffff",
  padding: "12px 30px",
  borderRadius: "4px",
  fontWeight: "bold",
  textDecoration: "none",
};
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "11px",
  textAlign: "center" as const,
};
