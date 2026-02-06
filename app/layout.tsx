import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

// 1. Metadata MUST be in a Server Component
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
    <html lang="en">
      <body className="bg-white text-black antialiased">
        {/* 2. UPDATED TOASTER CONFIGURATION */}
        <Toaster
          // CHANGED: Moved to "bottom-right" so it doesn't block the Navbar icons
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1B2A4E", // Navy Blue
              color: "#FFFFFF", // White Text
              border: "1px solid #D4AF37", // Gold Border
              fontFamily: "serif",
              textTransform: "uppercase",
              fontSize: "12px", // Added slightly smaller font for elegance
              letterSpacing: "0.1em", // Added spacing for "Luxe" look
            },
          }}
        />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
