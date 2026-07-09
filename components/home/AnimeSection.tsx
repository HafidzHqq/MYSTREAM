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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-text-secondary font-medium mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 hover:border-white/20 transition-all group backdrop-blur-sm"
          >
            Lihat Semua
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
