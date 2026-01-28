import { client } from "@/sanity/lib/client";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

async function getOrderDetails(id: string) {
  return client.fetch(
    `*[_type == "order" && _id == $id][0]{
      ...,
      items[]{
        ...,
        product->{
          name,
          price,
          // Robust image fetching using coalesce
          "image": coalesce(image.asset->url, productImage.asset->url, mainImage.asset->url)
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

  if (!order || order.email?.toLowerCase() !== userEmail?.toLowerCase()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <Link href="/orders" className="flex items-center text-sm text-zinc-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Order Details</h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">{order.orderNumber}</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-100">
          {order.status}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-zinc-50/50">
              <h2 className="font-bold flex items-center gap-2 text-sm text-zinc-700">
                <Package className="h-4 w-4" /> Items Ordered
              </h2>
            </div>
            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => {
                const unitPrice = item.priceAtPurchase ?? item.product?.price ?? 0;
                const quantity = item.quantity ?? 1;

                return (
                  <div key={idx} className="p-6 flex gap-4 items-center">
                    {/* --- UPDATED IMAGE PART START --- */}
                    <div className="h-20 w-20 rounded-lg bg-zinc-50 overflow-hidden shrink-0 border border-zinc-100 flex items-center justify-center">
                      {item.product?.image ? (
                        <img 
                          src={item.product.image} 
                          alt="" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="text-center">
                          <Package className="h-4 w-4 mx-auto text-zinc-300 mb-1" />
                          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">No Image</p>
                        </div>
                      )}
                    </div>
                    {/* --- UPDATED IMAGE PART END --- */}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 truncate">{item.product?.name || "Jewelry Piece"}</h3>
                      <p className="text-sm text-zinc-500">Quantity: {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zinc-900">${unitPrice * quantity}</p>
                      {quantity > 1 && <p className="text-[10px] text-zinc-400">${unitPrice} each</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="font-bold mb-4 text-sm text-zinc-700">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium">${order.totalPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3" style={{ color: '#D4AF37' }}>
                <span>Total Paid</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="rounded-xl border bg-zinc-900 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                <h2 className="font-bold text-sm">Shipping Update</h2>
              </div>
              <p className="text-zinc-400 text-xs mb-4">Your jewelry is on its way!</p>
              <div className="bg-white/10 rounded-lg p-3 border border-white/5">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Tracking Number</p>
                <p className="font-mono font-bold text-sm select-all">{order.trackingNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}