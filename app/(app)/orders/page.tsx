import { client } from "@/sanity/lib/client";
import OrderHistory from "@/components/OrderHistory";
// import { auth } from "@clerk/nextjs"; // Uncomment if you use Clerk

async function getOrders(email: string) {
  // This query finds every order in Sanity linked to this email
  return client.fetch(
    `*[_type == "order" && customerEmail == $email] | order(orderDate desc)`, 
    { email }
  );
}

export default async function OrdersPage() {
  // For now, use the email you used for your successful test
  // Once auth is ready, we will replace this with the logged-in user's email
  const userEmail = "your-test-email@gmail.com"; 
  
  const orders = await getOrders(userEmail);

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      <OrderHistory orders={orders} />
    </main>
  );
}