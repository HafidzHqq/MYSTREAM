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
    <div className="relative w-full overflow-hidden bg-bg-primary h-[80vh] min-h-[600px] max-h-[900px]">
      {/* Slides */}
      <div className="relative w-full h-full">
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
              {/* Background Blur Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover opacity-30 scale-105 transform origin-center"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/50 to-transparent" />
              </div>

              {/* Content Container */}
              <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-20 pb-10">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 lg:gap-16">
                  
                  {/* Left: Text & Actions */}
                  <div className={clsx("w-full md:w-3/5 xl:w-1/2 flex flex-col items-start transition-all duration-700 delay-100", isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
                    
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {item.type && (
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 border border-accent-blue/20 rounded-full backdrop-blur-sm">
                          {item.type}
                        </span>
                      )}
                      {item.score && (
                        <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20 rounded-full backdrop-blur-sm">
                          <Star className="w-3.5 h-3.5 fill-accent-yellow" />
                          {parseFloat(item.score.toString()).toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl line-clamp-3">
                      {item.title}
                    </h1>

                    {/* Synopsis */}
                    <p className="text-base md:text-lg text-text-secondary font-medium leading-relaxed max-w-2xl line-clamp-3 mb-8 drop-shadow-md">
                      {item.synopsis || "Saksikan keseruan petualangan anime ini lengkap dengan sub indo berkualitas tinggi. Update rilis cepat dan server streaming lancar."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={`/anime/${item.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/10"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        Mulai Menonton
                      </Link>
                      <Link
                        href={`/anime/${item.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-bold rounded-full transition-all hover:bg-white/20 hover:scale-105 backdrop-blur-md border border-white/10"
                      >
                        <Info className="w-5 h-5" />
                        Detail Info
                      </Link>
                    </div>
                  </div>

                  {/* Right: Poster Image */}
                  <div className={clsx("hidden md:flex w-full md:w-2/5 xl:w-1/3 items-center justify-center transition-all duration-1000 delay-300", isActive ? "translate-x-0 opacity-100 scale-100" : "translate-x-12 opacity-0 scale-95")}>
                    <div className="relative w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index === 0}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 max-w-7xl mx-auto px-2 sm:px-4 flex justify-between z-20 pointer-events-none">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:text-white hover:scale-110 transition-all shadow-xl pointer-events-auto"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:text-white hover:scale-110 transition-all shadow-xl pointer-events-auto"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentIndex ? "w-8 bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "w-2 bg-white/30 hover:bg-white/60"
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
