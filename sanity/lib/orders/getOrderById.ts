import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getOrderById(sessionId: string) {
  const ORDER_BY_ID_QUERY = defineQuery(`
    *[_type == "order" && stripeCheckoutSessionId == $sessionId][0] {
      orderNumber,
      totalPrice,
      currency,
      status,
      trackingNumber,
      customerName,
      email
    }
  `);

  try {
    const order = await sanityFetch({
      query: ORDER_BY_ID_QUERY,
      params: { sessionId },
    });
    return order.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
}
