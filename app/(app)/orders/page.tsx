import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// This is the missing part that was causing the error!
async function getOrders(email: string) {
  // Changed customerEmail to email to match your Sanity Inspector!
  return client.fetch(
    `*[_type == "order" && lower(email) == lower($email)] | order(orderDate desc)`, 
    { email: email.trim() },
    { next: { revalidate: 0 } } 
  );
}

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    return <div className="pt-24 text-center text-red-500">Error: No email found for this account.</div>;
  }

  const orders = await getOrders(userEmail);

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      
      <OrderHistory orders={orders} />
    </main>
  );
}