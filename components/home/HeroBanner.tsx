"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { clsx } from "clsx";

interface HeroAnime {
  slug: string;
  title: string;
  thumbnail: string;
  synopsis?: string;
  score?: string | number;
  type?: string;
  provider?: string;
}

interface HeroBannerProps {
  items: HeroAnime[];
}

export function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const go = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const next = useCallback(() => go((current + 1) % items.length), [current, items.length, go]);
  const prev = useCallback(() => go((current - 1 + items.length) % items.length), [current, items.length, go]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  if (!items.length) return null;
  const item = items[current];

  return (
    <div className="relative h-[85vh] min-h-[560px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-700",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
          unoptimized
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div
          className={clsx(
            "max-w-2xl transition-all duration-700",
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}
        >
          {/* Type badge */}
          {item.type && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-purple/20 text-accent-purple border border-accent-purple/30 mb-3">
              {item.type}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text-primary leading-tight mb-3">
            {item.title}
          </h1>

          {/* Score */}
          {item.score && (
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">{item.score}</span>
            </div>
          )}

          {/* Synopsis */}
          {item.synopsis && (
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
              {item.synopsis}
            </p>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href={`/anime/${item.slug}?provider=${item.provider || "otakudesu"}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5 fill-white" />
              Tonton Sekarang
            </Link>
            <Link
              href={`/anime/${item.slug}?provider=${item.provider || "otakudesu"}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
              Detail
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-3">
          <button onClick={prev} className="p-2 rounded-full glass border border-white/10 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4 text-text-primary" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={clsx(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 h-2 bg-accent-purple"
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <button onClick={next} className="p-2 rounded-full glass border border-white/10 hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4 text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
