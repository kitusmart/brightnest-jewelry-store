import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// This is the missing part that was causing the error!
async function getOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && lower(customerEmail) == lower($email)] | order(orderDate desc)`, 
    { email },
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
      {/* This yellow box will tell us exactly what Clerk is seeing */}
      <div className="bg-yellow-100 p-2 text-center text-xs border-b">
        Debug: Clerk Email is <strong>{userEmail}</strong>
      </div>
      <OrderHistory orders={orders} />
    </main>
  );
}