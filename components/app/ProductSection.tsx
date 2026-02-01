"use client";

import { ProductGrid } from "./ProductGrid";
import type {
  ALL_CATEGORIES_QUERYResult,
  FILTER_PRODUCTS_BY_NAME_QUERYResult,
} from "@/sanity.types";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
  searchQuery: string;
}

export function ProductSection({ products, searchQuery }: ProductSectionProps) {
  return (
    <div className="flex flex-col">
      {/* --- REPLACEMENT: ONLY SHOW TEXT IF SEARCHING --- */}
      {/* I deleted the "Pieces Collection" count here. */}
      {searchQuery && (
        <div className="flex items-center justify-center mb-8">
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Results for &quot;
            <span className="font-medium text-black">{searchQuery}</span>
            &quot;
          </p>
        </div>
      )}

      {/* --- FULL WIDTH GRID (No Sidebar) --- */}
      <div className="w-full">
        <main className="w-full">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
