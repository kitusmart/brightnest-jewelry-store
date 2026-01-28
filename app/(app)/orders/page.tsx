import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && customerEmail == $email] | order(orderDate desc)`, 
    { email }
  );
}

export default async function OrdersPage() {
  // 1. Get the currently logged-in user from Clerk
  const user = await currentUser();

  // 2. If no user is logged in, redirect them to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // 3. Get their primary email address
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!userEmail) {
    return <div className="pt-24 text-center">No email found for this account.</div>;
  }

  // 4. Fetch only the orders that match THIS user's email
  const orders = await getOrders(userEmail);

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      <OrderHistory orders={orders} />
    </main>
  );
}