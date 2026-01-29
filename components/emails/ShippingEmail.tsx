import * as React from 'react';

export default function ShippingEmail({ customerName, orderNumber, trackingNumber }: any) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Your Brightnest Order has Shipped!</h2>
      <p>Hi {customerName},</p>
      <p>Order <strong>{orderNumber}</strong> is on its way.</p>
      <p>Tracking Number: {trackingNumber}</p>
    </div>
  );
}