import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { FILTER_PRODUCTS_BY_NAME_QUERYResult } from "@/sanity.types";

interface ProductGridProps {
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ProductGrid({ products }: ProductGridProps) {
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
    // Full width container with small luxury padding on the sides
    <div className="w-full px-4 md:px-6 lg:px-10 py-8">
      {/* Grid set to 5 columns on large screens to remove extra side space */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
} // <--- This was the bracket likely missing in your error screenshot
