"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
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
        "flex gap-6 py-6 transition-all duration-500",
        hasIssue && "bg-red-50/30 p-4 border-y border-red-100/50",
      )}
    >
      {/* 1. Image Area */}
      <div
        className={cn(
          "relative h-24 w-20 shrink-0 overflow-hidden bg-[#F9F9F9] border border-gray-100",
          isOutOfStock && "opacity-40 grayscale",
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">
            No Image
          </div>
        )}
      </div>

      {/* 2. Details Area */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-start gap-4">
          {/* FIXED: Using item.slug to prevent 404 errors */}
          <Link
            href={`/products/${item.slug}`}
            onClick={() => closeCart()}
            className={cn(
              "font-serif text-[13px] leading-tight text-[#1B2A4E] uppercase tracking-wider hover:text-[#D4AF37] transition-colors",
              isOutOfStock && "text-gray-400",
            )}
          >
            {item.name}
          </Link>

          <button
            className="text-gray-300 hover:text-[#1B2A4E] transition-colors p-1"
            onClick={() => removeItem(item.productId)}
          >
            <X size={14} strokeWidth={1.5} />
            <span className="sr-only">Remove</span>
          </button>
        </div>

        <p className="mt-2 text-[12px] font-bold text-[#D4AF37] tracking-[0.15em]">
          {formatPrice(item.price)}
        </p>

        {/* 3. Controls Area */}
        <div className="mt-auto pt-4 flex flex-row justify-between items-center border-t border-gray-50/50">
          <div className="scale-75 origin-left opacity-80">
            <StockBadge productId={item.productId} stock={currentStock} />
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-2 scale-90 origin-right">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mr-1">
                Qty
              </span>
              <AddToCartButton
                productId={item.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                stock={currentStock}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
