export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden bg-bg-secondary/70 border border-white/[0.06]">
      <div className="aspect-[2/3] w-full skeleton" />
      <div className="p-3 sm:p-3.5 space-y-2 bg-bg-card/40 flex-1">
        <div className="h-3.5 skeleton rounded-xl w-4/5" />
        <div className="h-3 skeleton rounded-xl w-1/2" />
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
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 skeleton rounded-xl w-48 mb-8" />
        <AnimeGridSkeleton count={6} />
      </div>
    </section>
  );
}
