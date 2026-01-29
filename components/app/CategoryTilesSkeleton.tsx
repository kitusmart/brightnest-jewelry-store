export function CategoryTilesSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-4 md:px-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className="flex-shrink-0 w-32 md:w-40 flex flex-col items-center gap-3 animate-pulse"
        >
          {/* Circular shimmer for the category image */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100" />
          {/* Small bar for the category name */}
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}