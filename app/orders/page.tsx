// 🟢 FIXED: Moved to the top to prevent the 'Modifiers cannot appear here' error
export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
// 🟢 ADDED: SignOutButton to handle the logout logic without a 404 page
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, LogOut } from "lucide-react";

async function getOrders(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  return client.fetch(
    `*[_type == "order" && lower(email) == $email] | order(orderDate desc) {
      ...,
      "items": items[] {
        ...,
        "product": product-> {
          _id,
          name,
          "image": coalesce(images[0].asset->url, image.asset->url), 
          "slug": slug.current
        }
      }
    }`,
    { email: cleanEmail },
    { next: { revalidate: 0 } },
  );
}

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1B2A4E] uppercase tracking-widest text-[10px] font-black">
        Error: Account profile incomplete.
      </div>
    );
  }

  const orders = await getOrders(userEmail);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/full_logo.png"
                alt="Elysia Luxe"
                className="h-8 md:h-12 w-auto object-contain"
              />
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                href="/orders"
                className="text-[#1B2A4E] border-b border-[#1B2A4E] pb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                Orders
              </Link>
              <Link
                href="/account"
                className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#1B2A4E] transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[10px] font-bold text-[#1B2A4E] uppercase tracking-[0.2em] px-4 py-2 border border-[#1B2A4E]/10 rounded-full hover:bg-[#1B2A4E] hover:text-white transition-all"
            >
              Go Shopping
            </Link>

            {/* 🟢 FIXED: Replaced <Link> with <SignOutButton> to prevent 404 error */}
            <SignOutButton redirectUrl="/">
              <button className="text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer">
                <LogOut size={12} />
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <h1 className="text-2xl font-serif text-[#1B2A4E] mb-10 uppercase tracking-widest">
          Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-[#F9F9F9] rounded-xl p-16 flex flex-col items-center justify-center border border-gray-50">
            <p className="text-[11px] text-[#1B2A4E] font-medium uppercase tracking-[0.3em] mb-8 text-center">
              No orders yet.
            </p>
            <Link
              href="/"
              className="text-[10px] font-bold text-[#1B2A4E] border-b border-[#1B2A4E] pb-1 uppercase tracking-[0.2em] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
            >
              Go to store to place an order.
            </Link>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <OrderHistory orders={orders} />
          </div>
        )}
      </div>
    </div>
  );
}
