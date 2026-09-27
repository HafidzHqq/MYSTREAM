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
    const interval = setInterval(nextSlide, 7500);
    return () => clearInterval(interval);
  }, [items.length, nextSlide]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-bg-primary h-[600px] sm:h-[580px] md:h-[640px] lg:h-[700px]">
      {/* Slides */}
      <div className="relative w-full h-full">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={`${item.slug}-${index}`}
              className={clsx(
                "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Ambient Backdrop */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover object-center opacity-40 filter blur-sm md:blur-md scale-105"
                  priority={index === 0}
                  unoptimized
                />
                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Main Content Container */}
              <div className="relative w-full h-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-24 pb-12 sm:pt-16 sm:pb-12">
                <div className="flex flex-col-reverse sm:flex-row items-center sm:items-center justify-center sm:justify-between w-full gap-6 sm:gap-8 lg:gap-14">
                  
                  {/* Left: Metadata & CTA */}
                  <div
                    className={clsx(
                      "flex-1 w-full md:w-3/5 lg:w-7/12 flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-500",
                      isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}
                  >
                    {/* Badge Row */}
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3 sm:mb-3.5">
                      {item.type && (
                        <span className="px-2.5 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                          {item.type}
                        </span>
                      )}
                      {item.score && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-400/10 rounded-xl border border-amber-400/20 backdrop-blur-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{parseFloat(item.score.toString()).toFixed(1)}</span>
                        </div>
                      )}
                      <span className="px-2.5 py-1 text-[10px] sm:text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-xl border border-emerald-400/20">
                        Sub Indo
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-3 md:mb-4 line-clamp-2">
                      {item.title}
                    </h1>

                    {/* Synopsis */}
                    <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-xl line-clamp-2 md:line-clamp-3 mb-6">
                      {item.synopsis || "Saksikan episode terbaru anime ini dengan kualitas visual jernih dan streaming lancar tanpa hambatan."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
                      <Link
                        href={`/anime/${item.slug}`}
                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2.5 px-6 py-3 sm:py-3.5 bg-white text-black font-bold rounded-xl text-sm md:text-base hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
                      >
                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        Tonton Sekarang
                      </Link>
                      <Link
                        href={`/anime/${item.slug}`}
                        className="inline-flex justify-center items-center gap-2 px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm md:text-base backdrop-blur-md border border-white/20 transition-all active:scale-95"
                      >
                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Detail</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right: Featured Poster on Desktop & Mobile */}
                  <div
                    className={clsx(
                      "flex w-32 sm:w-44 md:w-60 lg:w-72 shrink-0 transition-all duration-700",
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    )}
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 group">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent hidden sm:block" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Arrows */}
      {items.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full 2xl:px-16 mx-auto px-4 hidden md:flex justify-between z-20 pointer-events-none">
          <button
            onClick={prevSlide}
            className="p-3 rounded-xl-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-all pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 rounded-xl-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-all pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Bottom Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-20 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={clsx(
                "h-1.5 rounded-xl-full transition-all duration-500",
                i === currentIndex
                  ? "w-8 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                  : "w-2 bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
