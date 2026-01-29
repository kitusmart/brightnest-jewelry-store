"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products";
import { getOrCreateStripeCustomer } from "@/lib/actions/customer";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any, // Add 'as any' to bypass the version mismatch error
});

// Types
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  items: CartItem[],
): Promise<CheckoutResult> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return {
        success: false,
        error: "Please sign in to secure your treasures.",
      };
    }

    if (!items || items.length === 0) {
      return { success: false, error: "Your nest is currently empty." };
    }

    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    const validationErrors: string[] = [];
    const validatedItems: {
      product: any;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId,
      );

      if (!product) {
        validationErrors.push(`"${item.name}" is no longer in our collection.`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(
          `"${product.name}" has returned to the vault (Out of Stock).`,
        );
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Only ${product.stock} of "${product.name}" are available for your nest.`,
        );
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 1. LUXURY REFINEMENT: Updated to INR for India Market
    // Inside createCheckoutSession function
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validatedItems.map(({ product, quantity }) => ({
        price_data: {
          currency: "AUD", // Keep this as AUD for Australia
          product_data: {
            name: product.name ?? "Jewelry Piece",
            images: product.image?.asset?.url ? [product.image.asset.url] : [],
            metadata: {
              productId: product._id,
            },
          },
          unit_amount: Math.round((product.price ?? 0) * 100), // Prices in cents
        },
        quantity,
      }));

    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    const { stripeCustomerId, sanityCustomerId } =
      await getOrCreateStripeCustomer(userEmail, userName, userId);

    const metadata = {
      clerkUserId: userId,
      userEmail,
      sanityCustomerId,
      productIds: validatedItems.map((i) => i.product._id).join(","),
      quantities: validatedItems.map((i) => i.quantity).join(","),
    };

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // 2. BOUTIQUE LOGIC: Restricting countries for faster shipping
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer: stripeCustomerId,
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "AE"], // Curated focus list
      },
      metadata,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return { success: true, url: session.url ?? undefined };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "The vault is temporarily locked. Please try again shortly.",
    };
  }
}

/**
 * Retrieves a checkout session by ID (used by /checkout/success)
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Authentication required." };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    if (session.metadata?.clerkUserId !== userId) {
      return { success: false, error: "Session not found." };
    }

    return {
      success: true,
      session: {
        id: session.id,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        amountTotal: session.amount_total,
        paymentStatus: session.payment_status,
        shippingAddress: session.customer_details?.address,
        lineItems: session.line_items?.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          amount: item.amount_total,
        })),
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Could not retrieve order details." };
  }
}
