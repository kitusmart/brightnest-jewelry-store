import * as React from "react";

interface ShippingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
}

export const ShippingEmail = ({
  customerName,
  orderNumber,
  trackingNumber,
}: ShippingEmailProps) => (
  <div style={{ fontFamily: "serif", padding: "20px", color: "#333" }}>
    <h1 style={{ color: "#D4AF37", textTransform: "uppercase" }}>Brightnest</h1>
    <h2>Your Jewelry is on its way!</h2>
    <p>Hi {customerName},</p>
    <p>
      Exquisite taste deserves exquisite service. Your order has been shipped.
    </p>
    <div
      style={{ background: "#fbf7ed", padding: "15px", borderRadius: "10px" }}
    >
      <p>
        <strong>Order:</strong> {orderNumber}
      </p>
      <p>
        <strong>Tracking Number:</strong> {trackingNumber}
      </p>
    </div>
    <p style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
      ELEVATE YOUR SHINE
    </p>
  </div>
);
