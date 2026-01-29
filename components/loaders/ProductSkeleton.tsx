export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-lg w-full" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
      <div className="h-10 bg-gray-100 rounded w-full mt-2" />
    </div>
  );
}