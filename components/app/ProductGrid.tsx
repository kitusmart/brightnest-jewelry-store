import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

interface ProductGridProps {
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ProductGrid({ products }: ProductGridProps) {
  // 1. Empty State: Shows if a category or search has no items [cite: 8-21]
  if (products.length === 0) {
    return (
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 mb-4">
          <PackageSearch className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-bold text-black">No products found</h3>
        <p className="mt-2 text-sm text-gray-600">
          We searched for that category, but this product seems to be filed
          under "Jewelry" instead!
        </p>
      </div>
    );
  }

  return (
    /* 2. Outer Container: 
       - overflow-x-hidden prevents accidental side-scrolling.
       - Reduced px-2 on mobile allows jewelry images to be 15% larger [cite: 24-25].
    */
    <div className="w-full px-2 md:px-6 lg:px-10 py-8 overflow-x-hidden">
      {/* 3. The Grid:
         - grid-cols-2 (Mobile): Maximize image size [cite: 26-27].
         - md:grid-cols-3 (Tablet): Fixes the 768px "wide card" glitch.
         - lg:grid-cols-5 (Desktop): Professional luxury layout.
         - -mx-1 (Negative Margin): Pulls cards to the edge to fix the "Right Side Gap".
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6 lg:gap-8 -mx-1">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
