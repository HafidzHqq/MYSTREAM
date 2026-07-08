"use client";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Clock } from "lucide-react";
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
  className?: string;
}

export function AnimeCard({
  slug,
  title,
  thumbnail,
  type,
  status,
  episode,
  score,
  provider = "otakudesu",
  className,
}: AnimeCardProps) {
  const href = `/anime/${slug}?provider=${provider}`;

  return (
    <Link href={href} className={clsx("group block", className)}>
      <div className="relative overflow-hidden rounded-2xl bg-bg-card border border-white/5 card-glow">
        {/* Thumbnail */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-accent-purple/90 backdrop-blur flex items-center justify-center shadow-glow">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {type && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-accent-purple/90 text-white backdrop-blur-sm">
                {type}
              </span>
            )}
            {status === "Ongoing" && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-green-500/90 text-white backdrop-blur-sm">
                Ongoing
              </span>
            )}
          </div>

          {/* Score */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">{score}</span>
            </div>
          )}

          {/* Episode info */}
          {episode && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>{episode}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-text-primary line-clamp-2 leading-snug group-hover:text-accent-purple transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
