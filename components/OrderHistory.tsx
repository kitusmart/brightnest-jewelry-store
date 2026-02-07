"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // 🟢 Added for images
import { Package, ChevronRight, Calendar, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice: number | string;
  trackingNumber?: string;
  // 🟢 Added items to the interface so the component can 'see' them
  items?: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
  }>;
}

export default function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex flex-col mb-12">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-2">
          Your Collection
        </span>
        <h2 className="text-4xl font-serif text-[#1B2A4E] uppercase tracking-tight">
          Purchase History
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#fbf7ed]/20 border border-dashed border-[#D4AF37]/20">
          <p className="text-[#1B2A4E] font-serif text-lg mb-6">
            Your history is as clear as a diamond.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#1B2A4E] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-700"
          >
            Start Your Journey
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group bg-white border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#fbf7ed]"
            >
              {/* Top Banner */}
              <div className="bg-[#1B2A4E] px-8 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/50 uppercase tracking-[0.2em] font-black">
                    Reference
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase">
                    #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={10} className="text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                    {order.status || "Processing"}
                  </span>
                </div>
              </div>

              <div className="p-8">
                {/* 🟢 NEW: Product List Section */}
                <div className="space-y-4 mb-8">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-gray-50/50 p-3"
                    >
                      <div className="relative w-16 h-16 bg-white border border-gray-100 flex-shrink-0">
                        {item.product?.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-serif text-[#1B2A4E] uppercase tracking-tight">
                          {item.product?.name || "Luxury Piece"}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 pb-8 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-[#D4AF37]" />
                    <p className="text-[12px] text-[#1B2A4E] font-medium tracking-wide">
                      {new Date(order.orderDate).toLocaleDateString("en-AU", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                      Total Investment
                    </p>
                    <p className="text-2xl font-bold text-[#1B2A4E]">
                      {typeof order.totalPrice === "number"
                        ? formatPrice(order.totalPrice)
                        : order.totalPrice}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/orders/${order._id}`}
                  className="w-full flex items-center justify-center gap-3 border border-[#1B2A4E] py-4 text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.4em] hover:bg-[#1B2A4E] hover:text-white transition-all duration-500"
                >
                  View Order Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
