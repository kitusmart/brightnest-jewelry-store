"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/app/CheckoutButton";
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";

export function CheckoutClient() {
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-6 text-2xl font-bold text-black">
            Your cart is empty
          </h1>
          <p className="mt-2 text-gray-500">
            Add some items to your cart before checking out.
          </p>
          <Button
            asChild
            className="mt-8 bg-black text-white hover:bg-gray-800"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-black">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-semibold text-black">
                  Order Summary ({totalItems} items)
                </h2>
              </div>

              {/* Stock Issues Warning */}
              {hasStockIssues && !isLoading && (
                <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>
                    Some items have stock issues. Please update your cart before
                    proceeding.
                  </span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Verifying stock...
                  </span>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const stockInfo = stockMap.get(item.productId);
                  const hasIssue =
                    stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                  return (
                    <div
                      key={item.productId}
                      className={`flex gap-4 px-6 py-4 ${
                        hasIssue ? "bg-red-50" : "bg-white"
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-black">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {stockInfo?.isOutOfStock && (
                            <p className="mt-1 text-sm font-medium text-red-600">
                              Out of stock
                            </p>
                          )}
                          {stockInfo?.exceedsStock &&
                            !stockInfo.isOutOfStock && (
                              <p className="mt-1 text-sm font-medium text-amber-600">
                                Only {stockInfo.currentStock} available
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-medium text-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Total & Checkout */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h2 className="font-semibold text-black">Payment Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black font-medium">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-black font-medium">
                    Calculated at checkout
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-black">Total</span>
                    <span className="text-black">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <CheckoutButton disabled={hasStockIssues || isLoading} />
              </div>

              <p className="mt-4 text-center text-xs text-gray-500">
                You&apos;ll be redirected to Stripe&apos;s secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
