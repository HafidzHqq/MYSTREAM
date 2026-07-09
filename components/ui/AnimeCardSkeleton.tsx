export function AnimeCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border-[3px] border-black overflow-hidden brutal-box">
      <div className="aspect-[2/3] skeleton border-b-[3px] border-black" />
      <div className="p-3 space-y-2 bg-white">
        <div className="h-5 skeleton rounded-none w-full border-2 border-black" />
        <div className="h-5 skeleton rounded-none w-3/4 border-2 border-black" />
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
    <div className="relative h-[70vh] min-h-[500px] skeleton rounded-none border-b-[3px] border-black" />
  );
}

export function SectionSkeleton() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 skeleton rounded-none border-[3px] border-black w-64 mb-6" />
        <AnimeGridSkeleton count={6} />
      </div>
    </section>
  );
}
