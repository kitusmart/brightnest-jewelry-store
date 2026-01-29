"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartItems, useCartIsOpen, useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null; // FIXED: Prevents aria-controls hydration mismatch

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg gap-0 border-l border-gray-100 bg-white p-0">
        <SheetHeader className="px-6 py-8 border-b border-gray-50 bg-[#1B2A4E]">
          <SheetTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-serif text-xl tracking-[0.15em] uppercase">Your Nest ({totalItems})</span>
            </div>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-[#fbf7ed] rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="h-8 w-8 text-[#D4AF37] opacity-60" />
            </div>
            <h3 className="text-xl font-serif text-[#1B2A4E] uppercase tracking-widest">The Nest is Empty</h3>
            <button onClick={() => closeCart()} className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B2A4E] border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-all">Continue Browsing</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6 divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.productId} className="pt-6 first:pt-0">
                    <CartItem item={item} stockInfo={stockMap.get(item.productId)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 bg-[#fbf7ed]/30 p-6">
              <CartSummary hasStockIssues={hasStockIssues} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}