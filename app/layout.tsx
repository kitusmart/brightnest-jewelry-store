import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Brightnest | Elevate Your Shine",
  description:
    "Crafting timeless elegance for the modern woman. Our jewelry is designed to elevate your everyday radiance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="bg-white text-black antialiased">
        {/* ⭐ ULTIMATE FIX: This version uses the correct props to kill the bottom toast */}
        <Toaster
          position="top-right"
          visibleToasts={1}
          expand={false}
          // ⭐ We use className or style to override the container
          style={{ top: "20px", right: "20px" }}
          toastOptions={{
            style: {
              background: "#1B2A4E",
              color: "#FFFFFF",
              border: "1px solid #D4AF37",
              borderRadius: "0px",
              fontFamily: "serif",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
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
