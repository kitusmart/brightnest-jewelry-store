import { ProductSkeleton } from "@/components/loaders/ProductSkeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {/* We match the exact grid-cols and gap settings of your new store layout */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}