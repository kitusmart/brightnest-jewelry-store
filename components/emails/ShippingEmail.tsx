import * as React from 'react';

interface ShippingEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
}

const ShippingEmail = ({
  customerName,
  orderNumber,
  trackingNumber,
}: ShippingEmailProps) => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
      <h1 style={{ color: '#D4AF37' }}>BRIGHTNEST</h1>
      <h2>Your Order has Shipped!</h2>
      <p>Hi {customerName},</p>
      <p>Your order <strong>{orderNumber}</strong> is on its way.</p>
      <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <p><strong>Tracking Number:</strong> {trackingNumber}</p>
      </div>
    </div>
  );
};

export default ShippingEmail;