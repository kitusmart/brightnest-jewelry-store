// 🟢 FIXED: Moved to the top to prevent the 'Modifiers cannot appear here' error
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

/**
 * Fetches orders from Sanity based on the lowercased email address
 */
async function getOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && lower(email) == lower($email)] | order(orderDate desc) {
      ...,
      "items": items[] {
        ...,
        "product": product-> {
          _id,
          name,
          // 🟢 FIXED: Correctly pulls the first image from the 'images' array
          "image": images[0].asset->url, 
          "slug": slug.current
        }
      }
    }`,
    { email: email.trim() },
    { next: { revalidate: 0 } },
  );
}

export default async function OrdersPage() {
  const user = await currentUser();

  // 1. Force Sign-in for luxury security
  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-[#1B2A4E] uppercase tracking-widest text-[10px] font-black">
        Error: Account profile incomplete.
      </div>
    );
  }

  const orders = await getOrders(userEmail);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <header className="mb-16 text-center lg:text-left">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Client Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1B2A4E] tracking-tight uppercase">
            Your Purchase History
          </h1>
          <div className="h-px w-20 bg-[#D4AF37] mt-8 opacity-30 hidden lg:block" />
        </header>

        {/* 2. HANDLE EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#fbf7ed] bg-[#fbf7ed]/20">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm">
              <ShoppingBag size={24} className="text-[#D4AF37] opacity-40" />
            </div>
            <p className="text-[12px] text-[#1B2A4E] font-medium uppercase tracking-[0.2em] mb-8">
              Your history is as clear as a diamond.
            </p>
            <Link
              href="/"
              className="bg-[#1B2A4E] text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all duration-700 shadow-xl"
            >
              Start Your Collection
            </Link>
          </div>
        ) : (
          /* 3. Render the client-side OrderHistory component */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <OrderHistory orders={orders} />
          </div>
        )}
      </div>
    </main>
  );
}
