"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-sand rounded-full" />
          <div className="absolute inset-0 border-2 border-gold rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="font-serif text-lg text-muted animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Product Skeleton Card
export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] bg-cream animate-shimmer" />
      <div className="space-y-2">
        <div className="h-3 bg-cream w-16 animate-shimmer" />
        <div className="h-4 bg-cream w-3/4 animate-shimmer" />
        <div className="h-4 bg-cream w-20 animate-shimmer" />
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

// Category Skeleton
export function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-cream animate-shimmer" />
      <div className="h-6 bg-cream w-2/3 mx-auto animate-shimmer" />
    </div>
  );
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container-luxury py-32">
        <div className="max-w-2xl space-y-6">
          <div className="h-4 bg-sand w-24 animate-shimmer" />
          <div className="h-16 bg-sand w-full animate-shimmer" />
          <div className="h-16 bg-sand w-3/4 animate-shimmer" />
          <div className="h-4 bg-sand w-full animate-shimmer" />
          <div className="h-4 bg-sand w-2/3 animate-shimmer" />
          <div className="h-12 bg-sand w-40 animate-shimmer mt-8" />
        </div>
      </div>
    </div>
  );
}

// Cart Skeleton
export function CartSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 pb-6 border-b border-sand">
          <div className="w-24 h-32 bg-cream animate-shimmer flex-shrink-0" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-4 bg-cream w-3/4 animate-shimmer" />
            <div className="h-3 bg-cream w-1/2 animate-shimmer" />
            <div className="h-5 bg-cream w-20 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Checkout Skeleton
export function CheckoutSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border border-sand space-y-4">
            <div className="h-5 bg-cream w-32 animate-shimmer" />
            <div className="space-y-3">
              <div className="h-10 bg-cream w-full animate-shimmer" />
              <div className="h-10 bg-cream w-full animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="p-6 border border-sand space-y-4">
          <div className="h-5 bg-cream w-40 animate-shimmer" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-cream w-20 animate-shimmer" />
              <div className="h-4 bg-cream w-16 animate-shimmer" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-cream w-24 animate-shimmer" />
              <div className="h-4 bg-cream w-16 animate-shimmer" />
            </div>
            <div className="h-px bg-sand my-4" />
            <div className="flex justify-between">
              <div className="h-5 bg-cream w-16 animate-shimmer" />
              <div className="h-5 bg-cream w-20 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
