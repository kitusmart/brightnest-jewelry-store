import { SanityLive } from "@/sanity/lib/live";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartSheet } from "@/components/app/CartSheet";
import { ChatSheet } from "@/components/app/ChatSheet";
import { ClientProviders } from "@/components/providers/ClientProviders";
import ScrollToTop from "@/components/app/ScrollToTop";

// ⭐ REMOVED TOASTER FROM HERE

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>

      <WhatsAppFloat />
      <CartSheet />
      <ChatSheet />
      <SanityLive />

      {/* ⭐ DO NOT ADD TOASTER HERE. It is already in your root app/layout.tsx */}
    </ClientProviders>
  );
}
