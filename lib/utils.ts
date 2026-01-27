import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  currency: "USD" | "EUR" | "GBP" | "BDT" | "AUD" = "AUD",
  notation: "compact" | "standard" = "standard",
) {
  let numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderNumber(orderId: string) {
  // Returns just the last 6 characters to make it look clean (e.g., "AB12CD")
  return orderId.slice(-6).toUpperCase();
}
