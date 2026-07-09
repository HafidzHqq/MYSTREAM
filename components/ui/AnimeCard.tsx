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
  otakudesu: "bg-accent-pink/80 text-white backdrop-blur-sm",
  akompi: "bg-accent-blue/80 text-white backdrop-blur-sm",
  samehadaku: "bg-accent-purple/80 text-white backdrop-blur-sm",
  donghua: "bg-accent-green/80 text-white backdrop-blur-sm",
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
  const rawScore = typeof score === "object" && score !== null ? (score as any).value : score;
  const parsed = rawScore ? parseFloat(String(rawScore)) : NaN;
  const formattedScore = !isNaN(parsed) && parsed !== 0 ? parsed.toFixed(1) : null;
  const isAdult = provider === "nekopoi";

  const baseHref = isAdult ? `/nekopoi/watch/${slug}` : `/anime/${slug}`;
  const href = provider && provider !== "otakudesu" ? `${baseHref}?provider=${provider}` : baseHref;

  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-bg-secondary/40 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent-purple/20 hover:border-white/10">
        {/* Aspect Ratio Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-bg-secondary/80">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🎬
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80" />

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Badge: Episode */}
          {episode && (
            <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-bold bg-black/60 text-white backdrop-blur-md rounded-lg border border-white/10">
              EP {episode}
            </span>
          )}

          {/* Badge: Rating */}
          {formattedScore && formattedScore !== "0.0" && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-xs font-bold bg-black/60 text-white backdrop-blur-md rounded-lg border border-white/10">
              <Star className="w-3.5 h-3.5 fill-accent-yellow text-accent-yellow" />
              {formattedScore}
            </div>
          )}

          {/* Badge: Provider */}
          {provider && providerColors[provider] && (
            <span className={clsx(
              "absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10 shadow-lg",
              providerColors[provider]
            )}>
              {provider}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-grow flex flex-col justify-between z-10 bg-gradient-to-t from-bg-secondary to-transparent -mt-8 pt-10">
          <div>
            {type && (
              <p className="text-[10px] font-semibold text-accent-blue uppercase tracking-wider mb-1.5">
                {type}
              </p>
            )}
            <h3 className="font-bold text-sm md:text-base text-white line-clamp-2 leading-snug group-hover:text-accent-purple transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
