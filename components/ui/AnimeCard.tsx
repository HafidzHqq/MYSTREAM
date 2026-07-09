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
  otakudesu: "bg-accent-pink text-black border-2 border-black",
  akompi: "bg-accent-blue text-black border-2 border-black",
  samehadaku: "bg-accent-yellow text-black border-2 border-black",
  donghua: "bg-accent-green text-black border-2 border-black",
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
      <div className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white brutal-box brutal-hover">
        {/* Aspect Ratio Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200 border-b-[3px] border-black">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🎬
            </div>
          )}

          {/* Hover Play Button (Brutalist style) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/40 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-accent-yellow border-4 border-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:translate-y-1 group-active:translate-x-1 group-active:shadow-none">
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            </div>
          </div>

          {/* Badge: Episode */}
          {episode && (
            <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-black bg-white text-black border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              EP {episode}
            </span>
          )}

          {/* Badge: Rating */}
          {formattedScore && formattedScore !== "0.0" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 text-xs font-black bg-accent-yellow text-black border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Star className="w-3.5 h-3.5 fill-black" />
              {formattedScore}
            </div>
          )}

          {/* Badge: Provider */}
          {provider && providerColors[provider] && (
            <span className={clsx(
              "absolute top-2 right-2 px-2 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              providerColors[provider]
            )}>
              {provider}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5 flex-grow flex flex-col justify-between bg-white group-hover:bg-accent-pink transition-colors">
          <div>
            {type && (
              <p className="text-[10px] font-black text-black uppercase tracking-wider mb-1 border-2 border-black inline-block px-1.5 bg-accent-cyan">
                {type}
              </p>
            )}
            <h3 className="font-black text-sm md:text-base text-black line-clamp-2 leading-tight group-hover:underline decoration-2 underline-offset-2">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
