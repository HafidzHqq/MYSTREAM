import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";
import { clsx } from "clsx";

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

const providerColors: Record<string, string> = {
  otakudesu: "bg-red-500/80 text-white",
  akompi: "bg-blue-500/80 text-white",
  samehadaku: "bg-orange-500/80 text-white",
  donghua: "bg-emerald-500/80 text-white",
};

export function AnimeCard({
  slug,
  title,
  thumbnail,
  type,
  episode,
  score,
  provider,
}: AnimeCardProps) {
  // Safe score formatting
  const formattedScore = score ? parseFloat(score.toString()).toFixed(1) : null;
  const isAdult = provider === "nekopoi";

  return (
    <Link href={isAdult ? `/nekopoi/watch/${slug}` : `/anime/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-bg-card border border-white/5 hover:border-accent-purple/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] hover:-translate-y-1">
        {/* Aspect Ratio Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-bg-overlay">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              🎬
            </div>
          )}

          {/* Overlay Dark Gradation */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-accent-purple/90 backdrop-blur flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] transform scale-75 group-hover:scale-100 transition-all">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Badge: Episode */}
          {episode && (
            <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-black/75 text-text-primary backdrop-blur-sm border border-white/10">
              Ep {episode}
            </span>
          )}

          {/* Badge: Rating */}
          {formattedScore && formattedScore !== "0.0" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-yellow-500/90 text-black backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-black" />
              {formattedScore}
            </div>
          )}

          {/* Badge: Provider */}
          {provider && providerColors[provider] && (
            <span className={clsx(
              "absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm",
              providerColors[provider]
            )}>
              {provider}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          {type && (
            <p className="text-[10px] font-bold text-accent-purple uppercase tracking-wider mb-1">
              {type}
            </p>
          )}
          <h3 className="font-semibold text-sm text-text-primary line-clamp-2 leading-snug group-hover:text-accent-purple transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
