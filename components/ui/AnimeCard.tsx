import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";

interface AnimeCardProps {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  status?: string;
  episode?: string;
  score?: string | number;
  provider?: string;
}

export function AnimeCard({
  slug,
  title,
  thumbnail,
  type,
  status,
  episode,
  score,
  provider,
}: AnimeCardProps) {
  const rawScore = typeof score === "object" && score !== null ? (score as any).value : score;
  const parsed = rawScore ? parseFloat(String(rawScore)) : NaN;
  const formattedScore = !isNaN(parsed) && parsed !== 0 ? parsed.toFixed(1) : null;
  const isAdult = provider === "nekopoi";

  const baseHref = isAdult ? `/nekopoi/watch/${slug}` : `/anime/${slug}`;
  const href = provider && provider !== "otakudesu" ? `${baseHref}?provider=${provider}` : baseHref;

  return (
    <Link href={href} className="group flex flex-col h-full focus:outline-none">
      <div className="relative flex flex-col h-full rounded-xl overflow-hidden bg-bg-secondary/70 border border-white/[0.07] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        {/* Poster Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-bg-secondary">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-text-muted bg-bg-secondary">
              🎬
            </div>
          )}

          {/* Vignette on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
            {formattedScore && formattedScore !== "0.0" ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-amber-400 font-bold text-[11px] border border-white/10 shadow-sm">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{formattedScore}</span>
              </div>
            ) : <span />}

            {type && (
              <span className="px-2 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/10 shadow-sm">
                {type}
              </span>
            )}
          </div>

          {/* Bottom Episode Badge */}
          {episode && (
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
              <span className="px-2 py-0.5 rounded-xl bg-black/75 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10 shadow-sm">
                EP {episode}
              </span>
            </div>
          )}

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-11 h-11 rounded-xl-full bg-white text-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-bg-card/40">
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-text-primary group-hover:text-white line-clamp-2 leading-snug transition-colors">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.04] text-[11px] text-text-muted">
            <span className="truncate">{status || "Sub Indo"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
