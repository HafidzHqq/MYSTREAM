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
    <section className={clsx("py-4", className)}>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text-muted hover:text-white transition-colors group shrink-0"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
