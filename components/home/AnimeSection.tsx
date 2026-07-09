import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimeCard } from "../ui/AnimeCard";
import { clsx } from "clsx";

interface AnimeItem {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  status?: string;
  episode?: string;
  score?: string | number;
  provider?: string;
}

interface AnimeSectionProps {
  title: string;
  subtitle?: string;
  items: AnimeItem[];
  viewAllHref?: string;
  provider?: string;
  className?: string;
}

export function AnimeSection({
  title,
  subtitle,
  items,
  viewAllHref,
  provider,
  className,
}: AnimeSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={clsx("py-6", className)}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black tracking-tight uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-black font-bold mt-2 bg-white border-2 border-black px-2 py-1 inline-block">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-white border-[3px] border-black text-black font-black uppercase tracking-wider brutal-hover hover:bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors group"
          >
            Lihat Semua
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[3]" />
          </Link>
        )}
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map((anime) => (
          <AnimeCard
            key={anime.slug}
            slug={anime.slug}
            title={anime.title}
            thumbnail={anime.thumbnail}
            type={anime.type}
            status={anime.status}
            episode={anime.episode}
            score={anime.score}
            provider={provider}
          />
        ))}
      </div>
    </section>
  );
}
