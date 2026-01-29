"use server";

import Stripe from "stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/lib/sanity/queries/customers";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

// FIXED: Using type casting to resolve the API version error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
});

/**
 * Gets or creates a Stripe customer by email
 * Also syncs the customer to Sanity database for history tracking
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  clerkUserId: string,
): Promise<{ stripeCustomerId: string; sanityCustomerId: string }> {
  // 1. Check for existing record in Sanity
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  if (existingCustomer?.stripeCustomerId) {
    return {
      stripeCustomerId: existingCustomer.stripeCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 2. Check Stripe for existing email to avoid duplicates
  const existingStripeCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  let stripeCustomerId: string;

  if (existingStripeCustomers.data.length > 0) {
    stripeCustomerId = existingStripeCustomers.data[0].id;
  } else {
    // 3. Create a new Stripe identity
    const newStripeCustomer = await stripe.customers.create({
      email,
      name,
      metadata: {
        clerkUserId,
      },
    });
    stripeCustomerId = newStripeCustomer.id;
  }

  // 4. Sync the IDs back to your Sanity database
  if (existingCustomer) {
    await writeClient
      .patch(existingCustomer._id)
      .set({ stripeCustomerId, clerkUserId, name })
      .commit();
    return {
      stripeCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 5. Create a new luxury customer profile in Sanity
  const newSanityCustomer = await writeClient.create({
    _type: "customer",
    email,
    name,
    clerkUserId,
    stripeCustomerId,
    createdAt: new Date().toISOString(),
  });

  return {
    stripeCustomerId,
    sanityCustomerId: newSanityCustomer._id,
  };
}
