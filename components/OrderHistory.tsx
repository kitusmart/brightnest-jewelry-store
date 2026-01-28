import React from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  trackingNumber?: string;
}

export default function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#D4AF37' }}>My Jewelry Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <span className="font-semibold text-sm text-gray-500">Order #{order.orderNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="font-bold mt-2">Total: ${order.totalPrice}</p>
              {order.trackingNumber && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Tracking:</strong> {order.trackingNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}