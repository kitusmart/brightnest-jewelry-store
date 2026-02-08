"use client";

import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  slug,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(productId);
  const [isAnimating, setIsAnimating] = useState(false);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    if (quantityInCart >= stock) {
      toast.error(`Only ${stock} pieces available in stock`, {
        id: "stock-limit",
      });
      return;
    }

    setIsAnimating(true);
    addItem({ productId, name, price, image, slug }, 1);

    // 🔥 UPDATED: Cleaner luxury notification for mobile
    toast.success("ADDED ONE MORE ITEM", { id: "cart-success" });

    setTimeout(() => setIsAnimating(false), 1500);
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(productId, quantityInCart - 1);
    }
  };

  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn(
          "h-11 w-full bg-gray-100 text-gray-400 cursor-not-allowed uppercase text-[10px] tracking-widest border-none",
          className,
        )}
      >
        Sold Out
      </Button>
    );
  }

  if (quantityInCart === 0) {
    return (
      <motion.div whileTap={{ scale: 0.97 }} className="w-full">
        <Button
          onClick={handleAdd}
          className={cn(
            "h-11 w-full bg-[#1B2A4E] text-white hover:bg-[#D4AF37] uppercase text-[10px] tracking-[0.2em] font-bold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md",
            className,
          )}
        >
          <AnimatePresence mode="wait">
            {isAnimating ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-white"
              >
                <Check className="h-4 w-4" />
                <span>Added</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Basket
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex h-11 w-full items-center rounded-lg border border-[#1B2A4E]/10 bg-white text-[#1B2A4E] overflow-hidden shadow-sm",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-none hover:bg-gray-50 text-[#1B2A4E] border-r border-gray-50 active:bg-gray-100 transition-colors"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex flex-col flex-1 items-center justify-center bg-[#fbf7ed]/30 h-full">
        <motion.span
          key={quantityInCart}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-sm font-bold tabular-nums"
        >
          {quantityInCart}
        </motion.span>
        {isAtMax && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[7px] uppercase text-[#D4AF37] font-black tracking-tighter"
          >
            LIMIT
          </motion.span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-full flex-1 rounded-none hover:bg-gray-50 text-[#1B2A4E] border-l border-gray-50 active:bg-gray-100 transition-colors",
          isAtMax && "opacity-20 cursor-not-allowed bg-gray-100",
        )}
        onClick={handleAdd}
        disabled={isAtMax}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
