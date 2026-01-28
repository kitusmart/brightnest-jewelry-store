import { client } from "@/sanity/lib/client";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, MapPin, Package } from "lucide-react";

async function getOrderDetails(id: string) {
  return client.fetch(
    `*[_type == "order" && _id == $id][0]{
      ...,
      items[]{
        ...,
        product->{
          name,
          price,
          "image": image.asset->url
        }
      }
    }`, 
    { id },
    { next: { revalidate: 0 } }
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!user) redirect("/sign-in");

  const order = await getOrderDetails(id);

  // Security check: Ensure this order belongs to the logged-in user
  if (!order || order.email.toLowerCase() !== userEmail?.toLowerCase()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <Link href="/orders" className="flex items-center text-sm text-zinc-500 hover:text-black mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Order Details</h1>
          <p className="text-zinc-500">#{order.orderNumber}</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm uppercase tracking-widest">
          {order.status}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-zinc-50/50">
              <h2 className="font-bold flex items-center gap-2">
                <Package className="h-4 w-4" /> Items Ordered
              </h2>
            </div>
            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex gap-4">
                  <div className="h-20 w-20 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border">
                    {item.product?.image && (
                      <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900">{item.product?.name || "Jewelry Piece"}</h3>
                    <p className="text-sm text-zinc-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-zinc-900">
                    ${(item.priceAtPurchase || item.product?.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${order.totalPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2" style={{ color: '#D4AF37' }}>
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="rounded-xl border bg-zinc-900 p-6 text-white shadow-lg">
              <h2 className="font-bold mb-2 flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                Shipping Update
              </h2>
              <p className="text-zinc-400 text-xs mb-3">Your jewelry is on the way!</p>
              <div className="bg-white/10 rounded-lg p-3 text-sm">
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest">Tracking Number</p>
                <p className="font-mono font-bold">{order.trackingNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}