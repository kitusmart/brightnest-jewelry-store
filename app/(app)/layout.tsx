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
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CartSheet />
      <ChatSheet />
      <SanityLive />
    </ClientProviders>
  );
}