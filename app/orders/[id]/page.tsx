import { client } from "@/sanity/lib/client";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MessageCircle,
  RefreshCw,
  Truck,
  LogOut,
  ExternalLink,
} from "lucide-react";
import PrintButton from "@/components/PrintButton";

async function getOrderDetails(id: string) {
  return client.fetch(
    `*[_type == "order" && _id == $id][0]{
      ...,
      trackingNumber,
      courier,
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
    { next: { revalidate: 0 } },
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!user) redirect("/sign-in");

  const order = await getOrderDetails(id);

  if (!order || order.email?.toLowerCase() !== userEmail?.toLowerCase()) {
    notFound();
  }

  // 🟢 LOGIC: Automatically generate tracking URLs for Melbourne's top couriers
  const getTrackingUrl = (courier: string, trackingNum: string) => {
    const courierName = courier?.toLowerCase() || "";
    if (courierName.includes("post"))
      return `https://auspost.com.au/mypost/track/#/details/${trackingNum}`;
    if (courierName.includes("star"))
      return `https://startrack.com.au/track/details?id=${trackingNum}`;
    if (courierName.includes("please"))
      return `https://www.couriersplease.com.au/tools-track/tracking-results?id=${trackingNum}`;
    if (courierName.includes("aramex"))
      return `https://www.aramex.com.au/tools/track?l=${trackingNum}`;
    return null;
  };

  const trackingUrl = getTrackingUrl(order.courier, order.trackingNumber);

  return (
    <div className="min-h-screen bg-white">
      {/* --- NAVIGATION: Stacked for Mobile, Row for Desktop --- */}
      <div className="border-b border-gray-100 py-4 md:py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/full_logo.png"
                alt="Elysia Luxe"
                className="h-7 md:h-12 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-3 md:gap-6">
              <Link
                href="/"
                className="text-[9px] md:text-[10px] font-bold text-[#1B2A4E] uppercase tracking-[0.2em] px-3 py-2 md:px-4 md:py-2 border border-[#1B2A4E]/10 rounded-full hover:bg-[#1B2A4E] hover:text-white transition-all"
              >
                <span className="md:hidden">Shop</span>
                <span className="hidden md:inline">Go Shopping</span>
              </Link>
              <SignOutButton redirectUrl="/">
                <button className="text-red-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer">
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </SignOutButton>
            </div>
          </div>
          <nav className="flex items-center gap-8 pt-2 md:pt-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link
              href="/orders"
              className="text-[#1B2A4E] border-b border-[#1B2A4E] pb-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              Orders
            </Link>
            <Link
              href="/account"
              className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#1B2A4E] transition-colors"
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 md:py-24">
        {/* --- NAVIGATION HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/orders"
            className="flex items-center text-sm text-zinc-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to My Orders</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <PrintButton />
        </div>

        {/* --- ORDER TITLE AND STATUS --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
              Order Details
            </h1>
            <p className="text-zinc-500 font-mono text-xs md:text-sm mt-1">
              Order ID: {order.orderNumber}
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] md:text-xs uppercase tracking-widest border border-blue-100">
            {order.status}
          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-zinc-50/50 flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2 text-sm text-zinc-700">
                  <Package className="h-4 w-4" /> Items Ordered
                </h2>
                <Link
                  href={`https://wa.me/919985394369?text=Hello%20Brightnest!%20I%20need%20help%20with%20my%20Order%3A%20${order.orderNumber}`}
                  target="_blank"
                  className="text-[10px] md:text-xs text-green-600 flex items-center gap-1 hover:underline no-print font-semibold"
                >
                  <MessageCircle className="h-3 w-3" /> Chat on WhatsApp
                </Link>
              </div>
              <div className="divide-y">
                {order.items?.map((item: any, idx: number) => {
                  const unitPrice =
                    item.priceAtPurchase ?? item.product?.price ?? 0;
                  const quantity = item.quantity ?? 1;
                  return (
                    <div key={idx} className="p-4 md:p-6">
                      <div className="flex gap-4 items-center mb-4">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-zinc-50 overflow-hidden shrink-0 border border-zinc-100 flex items-center justify-center">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <Package className="h-4 w-4 mx-auto text-zinc-300 mb-1" />
                              <p className="text-[10px] text-zinc-400 font-medium">
                                No Image
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-zinc-900 text-sm md:text-base truncate">
                            {item.product?.name || "Jewelry Piece"}
                          </h3>
                          <p className="text-xs md:text-sm text-zinc-500">
                            Quantity: {quantity}
                          </p>
                          <p className="font-bold text-zinc-900 mt-1">
                            ${unitPrice * quantity}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/products/${item.product?.slug || ""}`}
                        className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-xs font-semibold hover:bg-zinc-50 transition"
                      >
                        <RefreshCw className="h-3 w-3" /> Buy Again
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* 🟢 DYNAMIC DELIVERY TRACKING CARD */}
            {order.trackingNumber ? (
              <div className="rounded-xl border border-[#D4AF37]/30 bg-[#fbf7ed]/10 p-6 shadow-sm">
                <h2 className="font-bold mb-4 text-sm text-[#1B2A4E] flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#D4AF37]" /> Delivery Tracking
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                      Courier
                    </p>
                    <p className="text-sm font-bold text-zinc-900">
                      {order.courier || "Pending Dispatch"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                      Tracking Number
                    </p>
                    <p className="text-sm font-mono font-bold text-[#1B2A4E] bg-white p-2 border border-zinc-100 rounded break-all mt-1">
                      {order.trackingNumber}
                    </p>
                  </div>
                  <div className="pt-2">
                    {trackingUrl ? (
                      <Link
                        href={trackingUrl}
                        target="_blank"
                        className="w-full py-2 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-[#b8952f] transition-colors"
                      >
                        <ExternalLink size={12} /> Track Package
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded cursor-not-allowed"
                      >
                        Tracking Link Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Shipping Status
                </p>
                <p className="text-xs text-zinc-500 italic">
                  Tracking details will be provided once your jewelry piece is
                  dispatched.
                </p>
              </div>
            )}

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="font-bold mb-4 text-sm text-zinc-700">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-medium">${order.totalPrice}</span>
                </div>
                <div
                  className="flex justify-between font-bold text-lg border-t pt-3 mt-3"
                  style={{ color: "#D4AF37" }}
                >
                  <span>Total Paid</span>
                  <span>${order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
