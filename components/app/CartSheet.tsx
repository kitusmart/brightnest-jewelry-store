"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, ShoppingBag, X } from "lucide-react"; // Added X icon
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCartItems,
  useCartIsOpen,
  useCartActions,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg gap-0 border-l border-gray-100 bg-white p-0 overflow-hidden">
        {/* HEADER - Added explicit close button */}
        <SheetHeader className="px-6 py-8 border-b border-gray-50 bg-[#1B2A4E] z-10 relative">
          <SheetTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-serif text-xl tracking-[0.15em] uppercase">
                Your Nest ({totalItems})
              </span>
            </div>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
            )}
          </SheetTitle>

          {/* 🟢 NEW: High-contrast close button for all pixels */}
          <button
            onClick={() => closeCart()}
            className="absolute top-8 right-6 text-white/70 hover:text-[#D4AF37] transition-all hover:rotate-90"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex h-full flex-col items-center justify-center text-center px-10 py-20"
              >
                <div className="w-20 h-20 bg-[#fbf7ed] rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8 text-[#D4AF37] opacity-60" />
                </div>
                <h3 className="text-xl font-serif text-[#1B2A4E] uppercase tracking-widest">
                  The Nest is Empty
                </h3>
                <button
                  onClick={() => closeCart()}
                  className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B2A4E] border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-all"
                >
                  Continue Browsing
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="items"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="px-6 py-4"
              >
                <div className="space-y-6 divide-y divide-gray-50">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      className="pt-6 first:pt-0"
                    >
                      <CartItem
                        item={item}
                        stockInfo={stockMap.get(item.productId)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="border-t border-gray-100 bg-[#fbf7ed]/30 p-6 z-10"
          >
            <CartSummary hasStockIssues={hasStockIssues} />
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
