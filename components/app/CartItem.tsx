"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react"; // Using cleaner icons for quantity
import { useCartActions } from "@/lib/store/cart-store-provider";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { StockBadge } from "@/components/app/StockBadge";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/lib/store/cart-store";
import type { StockInfo } from "@/lib/hooks/useCartStock";

interface CartItemProps {
  item: CartItemType;
  stockInfo?: StockInfo;
}

export function CartItem({ item, stockInfo }: CartItemProps) {
  const { removeItem, closeCart } = useCartActions();

  const isOutOfStock = stockInfo?.isOutOfStock ?? false;
  const exceedsStock = stockInfo?.exceedsStock ?? false;
  const currentStock = stockInfo?.currentStock ?? 999;
  const hasIssue = isOutOfStock || exceedsStock;

  return (
    <div
      className={cn(
        "flex gap-5 py-5 transition-all duration-500",
        hasIssue && "bg-red-50/30 p-4 rounded-xl border border-red-100/50",
      )}
    >
      {/* 1. IMAGE AREA: Added soft shadow and rounded corners for "Pop" */}
      <div
        className={cn(
          "relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FDFDFD] shadow-sm border border-gray-50",
          isOutOfStock && "opacity-40 grayscale",
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
            sizes="100px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">
            No Image
          </div>
        )}
      </div>

      {/* 2. DETAILS AREA */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start gap-4">
          <Link
            href={`/products/${item.slug}`}
            onClick={() => closeCart()}
            className={cn(
              "font-serif text-[14px] font-medium leading-tight text-[#1B2A4E] uppercase tracking-wide hover:text-[#D4AF37] transition-colors",
              isOutOfStock && "text-gray-400",
            )}
          >
            {item.name}
          </Link>

          <button
            className="text-gray-300 hover:text-red-400 transition-colors p-1"
            onClick={() => removeItem(item.productId)}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* PRICE: Bolder and cleaner */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[14px] font-bold text-[#1B2A4E]">
            {formatPrice(item.price)}
          </span>
          {/* If you ever have sale logic, you can add it here in Gold */}
        </div>

        {/* 3. CONTROLS AREA: Styled to look like Nimee Circular buttons */}
        <div className="mt-4 flex flex-row justify-between items-center">
          <div className="scale-90 origin-left">
            <StockBadge productId={item.productId} stock={currentStock} />
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              {/* This AddToCartButton will now be wrapped in a cleaner UI */}
              <AddToCartButton
                productId={item.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                stock={currentStock}
                slug={item.slug}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
