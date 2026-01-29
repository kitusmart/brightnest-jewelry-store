import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/empty-state";
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
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @md:grid-cols-2 @xl:grid-cols-3 @6xl:grid-cols-4 @md:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
