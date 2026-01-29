"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/app/AppShell";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster position="bottom-center" />
        </ChatStoreProvider>
      </CartStoreProvider>
    </ClerkProvider>
  );
}