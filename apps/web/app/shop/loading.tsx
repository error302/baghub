import { ProductGridSkeleton } from "@/components/Skeletons";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="md:w-64 shrink-0">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}