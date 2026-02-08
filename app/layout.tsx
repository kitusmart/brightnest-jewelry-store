import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
// 1. IMPORT CLERK PROVIDER
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Elysia Luxe | Forever Defined",
  description: "Premium Jewelry for the Modern Woman",
  icons: {
    icon: "/favicon.png?v=6",
    shortcut: "/favicon.png?v=6",
    apple: "/favicon.png?v=6",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. WRAP EVERYTHING IN CLERKPROVIDER
    <ClerkProvider>
      <html lang="en">
        <body className="bg-white text-black antialiased">
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1B2A4E",
                color: "#FFFFFF",
                border: "1px solid #D4AF37",
                fontFamily: "serif",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.1em",
              },
            }}
          />
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
