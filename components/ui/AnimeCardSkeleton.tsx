export function AnimeCardSkeleton() {
  return (
    <div className="rounded-2xl bg-bg-secondary/40 backdrop-blur-md border border-white/5 overflow-hidden">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-4 space-y-3 bg-gradient-to-t from-bg-secondary to-transparent -mt-8 relative z-10 pt-10">
        <div className="h-4 skeleton rounded-md w-full" />
        <div className="h-4 skeleton rounded-md w-3/4" />
      </div>
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] min-h-[500px] skeleton w-full" />
  );
}

export function SectionSkeleton() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 skeleton rounded-lg w-48 mb-8" />
        <AnimeGridSkeleton count={6} />
      </div>
    </section>
  );
}
