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
  Link,
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
  const waUrl = `https://wa.me/61414002636?text=${encodeURIComponent("Hello Elysia Luxe, I have a question about my order.")}`;

  return (
    <Html>
      <Head />
      <Preview>
        {isShipped ? "Your luxury pieces are on their way!" : "Order Confirmed"}
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
            <Text style={subText}>
              {isShipped
                ? "Your luxury pieces have been carefully packed and are now on their way."
                : "We are getting your order ready."}
            </Text>

            <Section style={itemsContainer}>
              {/* 🟢 FIXED: WhatsApp Layout using standard spacing */}
              <Section style={{ marginBottom: "15px" }}>
                <table width="100%">
                  <tr>
                    <td align="left" style={sectionTitle}>
                      Products Ordered
                    </td>
                    <td align="right">
                      <Link href={waUrl} style={whatsappLink}>
                        <Img
                          src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png"
                          width="14"
                          height="14"
                          style={waIcon}
                        />
                        <span style={waText}>Chat on WhatsApp</span>
                      </Link>
                    </td>
                  </tr>
                </table>
              </Section>

              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <Section key={index} style={itemRow}>
                    <table width="100%">
                      <tr>
                        <td width="70" style={{ verticalAlign: "top" }}>
                          <Img
                            src={item.image}
                            width="70"
                            height="70"
                            style={productImg}
                            alt={item.productName}
                          />
                        </td>
                        <td style={detailsColumn}>
                          <Text style={productNameText}>
                            {item.productName}
                          </Text>
                          <Text style={productMeta}>
                            Qty: {item.quantity} | ${item.price}
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </Section>
                ))
              ) : (
                <Text style={emptyText}>
                  Click "Reply" to ask about your items
                </Text>
              )}

              <Hr style={summaryHr} />
              <Text style={summaryText}>
                Total Paid: <strong style={goldPrice}>${totalPrice}</strong>
              </Text>
            </Section>

            <Section style={trackingBox}>
              <Text style={trackingLabel}>
                {isShipped ? `${courier.toUpperCase()} TRACKING` : "STATUS"}
              </Text>
              <Text style={trackingId}>{trackingNumber}</Text>
              {isShipped && (
                <Button
                  style={button}
                  href={`https://www.google.com/search?q=${trackingNumber}`}
                >
                  Track Your Order
                </Button>
              )}
            </Section>

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

// --- STYLES ---
const main = {
  backgroundColor: "#f4f7f9",
  fontFamily: "sans-serif",
  padding: "20px 0",
};
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "560px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
};
const header = {
  backgroundColor: "#1B2A4E",
  padding: "25px 20px",
  textAlign: "center" as const,
};
const brandText = {
  color: "#D4AF37",
  fontSize: "24px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "0",
};
const tagline = {
  color: "#ffffff",
  fontSize: "9px",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "5px 0 0",
};
const content = { padding: "25px" };
const h1 = {
  color: "#1B2A4E",
  fontSize: "22px",
  textAlign: "center" as const,
  margin: "10px 0",
};
const text = {
  color: "#525f7f",
  fontSize: "15px",
  textAlign: "center" as const,
  margin: "5px 0",
};
const subText = {
  color: "#8898aa",
  fontSize: "14px",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
};
const itemsContainer = {
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  padding: "15px",
  margin: "15px 0",
};
const sectionTitle = { fontSize: "13px", fontWeight: "bold", color: "#1B2A4E" };
const whatsappLink = { textDecoration: "none", display: "inline-block" };
const waIcon = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "4px",
};
const waText = {
  fontSize: "12px",
  color: "#25D366",
  fontWeight: "bold",
  verticalAlign: "middle",
};
const itemRow = { marginBottom: "12px" };
const productImg = { borderRadius: "4px", border: "1px solid #f0f0f0" };
const detailsColumn = { paddingLeft: "12px", verticalAlign: "middle" };
const productNameText = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#1B2A4E",
  margin: "0",
};
const productMeta = { fontSize: "12px", color: "#8898aa", margin: "2px 0" };
const emptyText = {
  fontSize: "12px",
  color: "#8898aa",
  textAlign: "center" as const,
  padding: "10px 0",
};
const summaryHr = { borderColor: "#f0f0f0", margin: "10px 0" };
const summaryText = {
  textAlign: "right" as const,
  fontSize: "14px",
  color: "#1B2A4E",
  margin: "0",
};
const goldPrice = { color: "#D4AF37" };
const trackingBox = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "8px",
  border: "1px dashed #D4AF37",
  textAlign: "center" as const,
};
const trackingLabel = {
  color: "#8898aa",
  fontSize: "10px",
  fontWeight: "bold",
  marginBottom: "5px",
};
const trackingId = {
  color: "#1B2A4E",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
};
const button = {
  backgroundColor: "#D4AF37",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "4px",
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: "13px",
};
const footer = {
  color: "#b0adc5",
  fontSize: "11px",
  textAlign: "center" as const,
  marginTop: "20px",
};
