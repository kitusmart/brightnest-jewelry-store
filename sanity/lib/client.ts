import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// 🟢 UPDATED: Main client now uses a token to see orders on localhost
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  // Adding the token here allows localhost to bypass public restrictions
  token:
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

// Write client (remains the same for mutations/server actions)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
