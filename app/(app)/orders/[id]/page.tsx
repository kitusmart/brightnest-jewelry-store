import { client } from "@/sanity/lib/client";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Package, MessageCircle, RefreshCw } from "lucide-react";
// This is the functional button that won't crash your site
import PrintButton from "@/components/PrintButton";

async function getOrderDetails(id: string) {
  return client.fetch(
    `*[_type == "order" && _id == $id][0]{
      ...,
      items[]{
        ...,
        "product": product->{
          name,
          price,
          "slug": slug.current,
          "image": images[0].asset->url
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

  // Security check to ensure the user only sees their own jewelry orders
  if (!order || order.email?.toLowerCase() !== userEmail?.toLowerCase()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      {/* --- NAVIGATION HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/orders" className="flex items-center text-sm text-zinc-500 hover:text-black transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Orders
        </Link>
        
        {/* WE REPLACED THE OLD BUTTON WITH THIS ONE COMPONENT */}
        <PrintButton />
      </div>

      {/* --- ORDER TITLE AND STATUS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Order Details</h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">Order ID: {order.orderNumber}</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-100">
          {order.status}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* --- ITEMS LIST --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-zinc-50/50 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-sm text-zinc-700">
                <Package className="h-4 w-4" /> Items Ordered
              </h2>
              
              {/* UPDATED: WHATSAPP LINK WITH YOUR NUMBER */}
              <Link 
                href={`https://wa.me/919985394369?text=Hello%20Brightnest!%20I%20need%20help%20with%20my%20Order%3A%20${order.orderNumber}`}
                target="_blank"
                className="text-xs text-green-600 flex items-center gap-1 hover:underline no-print font-semibold"
              >
                <MessageCircle className="h-3 w-3" /> Chat on WhatsApp
              </Link>
            </div>
            
            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => {
                const unitPrice = item.priceAtPurchase ?? item.product?.price ?? 0;
                const quantity = item.quantity ?? 1;

                return (
                  <div key={idx} className="p-6">
                    <div className="flex gap-4 items-center mb-4">
                      {/* Fixed Jewelry Image Resolution */}
                      <div className="h-20 w-20 rounded-lg bg-zinc-50 overflow-hidden shrink-0 border border-zinc-100 flex items-center justify-center">
                        {item.product?.image ? (
                          <img src={item.product.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Package className="h-4 w-4 mx-auto text-zinc-300 mb-1" />
                            <p className="text-[10px] text-zinc-400 font-medium">No Image</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-900 truncate">{item.product?.name || "Jewelry Piece"}</h3>
                        <p className="text-sm text-zinc-500">Quantity: {quantity}</p>
                        <p className="font-bold text-zinc-900 mt-1">${unitPrice * quantity}</p>
                      </div>
                    </div>
                    {/* Buy Again Link */}
                    <Link 
                      href={`/products/${item.product?.slug || ''}`}
                      className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-sm font-semibold hover:bg-zinc-50 transition"
                    >
                      <RefreshCw className="h-3 w-3" /> Buy Again
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- SUMMARY SIDEBAR --- */}
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
        </div>
      </div>
    </div>
  );
}