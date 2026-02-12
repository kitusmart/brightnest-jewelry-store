import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🟢 Define routes that do NOT require login
// We include the home page, product pages, api routes (for Stripe/Sanity), and the Success page.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)", // 🟢 Critical: Lets Stripe & Sanity talk to your backend
  "/checkout/success", // 🟢 Critical: Lets Guests see the "Thank You" page
  "/products(.*)", // Optional: If you have specific product routes
  "/collections(.*)", // Optional: If you have collection routes
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
