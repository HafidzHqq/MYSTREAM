export function AnimeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-bg-card border border-white/5 overflow-hidden animate-pulse">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded-md w-full" />
        <div className="h-4 skeleton rounded-md w-3/4" />
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] skeleton rounded-none" />
  );
}

export function SectionSkeleton() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 skeleton rounded-lg w-48 mb-6" />
        <AnimeGridSkeleton count={6} />
      </div>
    </section>
  );
}
