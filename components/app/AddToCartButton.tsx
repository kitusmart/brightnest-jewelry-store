"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
  className,
}: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(productId);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    // 🟢 BLOCK: If they try to go over the 8 pieces in Sanity
    if (quantityInCart >= stock) {
      toast.error(`Only ${stock} pieces available in stock`);
      return;
    }

    addItem({ productId, name, price, image }, 1);
    toast.success(`Added ${name} to basket`);
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(productId, quantityInCart - 1);
    }
  };

  // 1. OUT OF STOCK STATE
  if (isOutOfStock) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn(
          "h-11 w-full bg-gray-100 text-gray-400 cursor-not-allowed uppercase text-[10px] tracking-widest",
          className,
        )}
      >
        Sold Out
      </Button>
    );
  }

  // 2. INITIAL ADD STATE (Black Button)
  if (quantityInCart === 0) {
    return (
      <Button
        onClick={handleAdd}
        className={cn(
          "h-11 w-full bg-black text-white hover:bg-gray-800 uppercase text-[10px] tracking-widest font-bold",
          className,
        )}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add to Basket
      </Button>
    );
  }

  // 3. QUANTITY CONTROL STATE (When already in cart)
  return (
    <div
      className={cn(
        "flex h-11 w-full items-center rounded-md border border-gray-200 bg-white text-black overflow-hidden",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-full flex-1 rounded-none hover:bg-gray-50 text-black border-r border-gray-100"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex flex-col flex-1 items-center justify-center bg-gray-50/50 h-full">
        <span className="text-sm font-bold tabular-nums text-black">
          {quantityInCart}
        </span>
        {/* 🟢 NEW: Small label to show they hit the limit */}
        {isAtMax && (
          <span className="text-[8px] uppercase text-orange-600 font-bold">
            Max
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        // 🟢 DISABLE: The "+" button turns off when they reach 8
        className={cn(
          "h-full flex-1 rounded-none hover:bg-gray-50 text-black border-l border-gray-100",
          isAtMax && "opacity-20 cursor-not-allowed bg-gray-100",
        )}
        onClick={handleAdd}
        disabled={isAtMax}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
