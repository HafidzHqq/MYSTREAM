import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { clsx } from "clsx";

interface AnimeItem {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  status?: string;
  episode?: string;
  score?: string | number;
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
  provider = "otakudesu",
  className,
}: AnimeSectionProps) {
  return (
    <section className={clsx("py-10", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-6 rounded-full bg-gradient-primary" />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-text-muted text-sm ml-4">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-accent-purple hover:text-blue-400 font-medium transition-colors group"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <AnimeCard
              key={item.slug}
              {...item}
              provider={provider}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
