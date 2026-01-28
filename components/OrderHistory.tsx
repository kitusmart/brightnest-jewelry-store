import React from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice: number | string;
  trackingNumber?: string;
}

export default function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8" style={{ color: '#D4AF37' }}>My Jewelry Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/" className="font-semibold" style={{ color: '#D4AF37' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Order ID</p>
                  <p className="font-mono font-bold">#{order.orderNumber}</p>
                </div>
                <div className="text-right">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <p className="text-sm text-gray-600">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p className="text-sm font-bold text-right">Total: ${order.totalPrice}</p>
              </div>

              {/* Dynamic Link to your [id] folder */}
              <Link 
                href={`/orders/${order._id}`} 
                className="w-full block text-center bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
              >
                View Order Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}