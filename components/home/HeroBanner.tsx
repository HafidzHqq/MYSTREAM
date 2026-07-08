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
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(nextSlide, 7000); // 7s auto slide
    return () => clearInterval(interval);
  }, [items.length, nextSlide]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative h-[60vh] md:h-[75vh] min-h-[450px] max-h-[700px] w-full overflow-hidden bg-black">
      {/* Slides */}
      {items.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={item.slug}
            className={clsx(
              "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {/* Backdrop Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover object-top filter brightness-[0.4] blur-[2px]"
                priority={index === 0}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-transparent to-transparent hidden md:block" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-0 pt-20">
                <div className="max-w-2xl text-left">
                  {/* Badge Row */}
                  <div className="flex items-center gap-3 mb-4">
                    {item.type && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent-purple/20 text-accent-purple border border-accent-purple/30 backdrop-blur-md">
                        {item.type}
                      </span>
                    )}
                    {item.score && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {parseFloat(item.score.toString()).toFixed(1)}
                      </div>
                    )}
                    {item.provider && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-text-secondary border border-white/10 backdrop-blur-md">
                        {item.provider}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-text-primary tracking-tight leading-none mb-4 line-clamp-2 drop-shadow-md">
                    {item.title}
                  </h1>

                  {/* Synopsis (hidden on tiny mobile) */}
                  <p className="text-sm md:text-base text-text-secondary line-clamp-3 mb-8 leading-relaxed max-w-xl hidden sm:block">
                    {item.synopsis || "Saksikan keseruan petualangan anime ini lengkap dengan sub indo berkualitas tinggi. Update rilis cepat dan server streaming lancar."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/anime/${item.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold hover:scale-105 transition-all duration-300 shadow-glow"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Tonton Sekarang
                    </Link>
                    <Link
                      href={`/anime/${item.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-text-primary font-bold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <Info className="w-4 h-4" />
                      Detail Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons (Only if > 1 item) */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-white/10 text-white transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-white/10 text-white transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "w-6 bg-accent-purple" : "w-1.5 bg-white/40"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
