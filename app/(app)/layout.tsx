import { SanityLive } from "@/sanity/lib/live";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartSheet } from "@/components/app/CartSheet";
import { ChatSheet } from "@/components/app/ChatSheet";
import { ClientProviders } from "@/components/providers/ClientProviders";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {/* The min-h-screen and flex-col classes ensure the footer 
        stays at the bottom of the page on all devices.
      */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>

      {/* Floating & Utility Components */}
      <WhatsAppFloat />
      <CartSheet />
      <ChatSheet />
      <SanityLive />
    </ClientProviders>
  );
}