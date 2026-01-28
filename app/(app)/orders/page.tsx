import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// This function now ignores capital letters to ensure a match
async function getOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && lower(customerEmail) == lower($email)] | order(orderDate desc)`, 
    { email },
    { next: { revalidate: 0 } } // Forces the page to check Sanity every time
  );
}

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Use the primary email from Clerk
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    return <div className="pt-24 text-center">No email found for this account.</div>;
  }

  const orders = await getOrders(userEmail);

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      <OrderHistory orders={orders} />
    </main>
  );
}