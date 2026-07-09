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

const brutalColors = ["bg-accent-yellow", "bg-accent-pink", "bg-accent-cyan", "bg-accent-blue"];

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
    <div className="relative w-full overflow-hidden border-b-[3px] border-black bg-white">
      {/* Slides */}
      <div className="relative h-[80vh] md:h-[70vh] min-h-[600px] max-h-[800px] w-full">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const bgColor = brutalColors[index % brutalColors.length];
          return (
            <div
              key={item.slug}
              className={clsx(
                "absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out flex flex-col md:flex-row",
                bgColor,
                isActive ? "translate-x-0 z-10" : "translate-x-full z-0 pointer-events-none"
              )}
            >
              {/* Content Container */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 md:p-12 lg:p-20 order-2 md:order-1 border-t-[3px] md:border-t-0 md:border-r-[3px] border-black bg-white">
                <div className="max-w-xl text-left w-full">
                  {/* Badge Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {item.type && (
                      <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-accent-cyan border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                        {item.type}
                      </span>
                    )}
                    {item.score && (
                      <div className="flex items-center gap-1 px-3 py-1 text-xs font-black bg-accent-yellow border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                        <Star className="w-4 h-4 fill-black" />
                        {parseFloat(item.score.toString()).toFixed(1)}
                      </div>
                    )}
                    {item.provider && (
                      <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                        {item.provider}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none mb-6 line-clamp-3 uppercase">
                    {item.title}
                  </h1>

                  {/* Synopsis (hidden on tiny mobile) */}
                  <p className="text-base md:text-lg text-black font-bold border-l-4 border-black pl-4 line-clamp-3 mb-8 bg-white/50 backdrop-blur-sm hidden sm:block">
                    {item.synopsis || "Saksikan keseruan petualangan anime ini lengkap dengan sub indo berkualitas tinggi. Update rilis cepat dan server streaming lancar."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                      href={`/anime/${item.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-yellow border-[3px] border-black text-black font-black text-lg transition-all brutal-hover hover:bg-accent-pink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase"
                    >
                      <Play className="w-6 h-6 fill-black" />
                      Tonton
                    </Link>
                    <Link
                      href={`/anime/${item.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-[3px] border-black text-black font-black text-lg transition-all brutal-hover hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase"
                    >
                      <Info className="w-6 h-6" />
                      Info
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Image Container */}
              <div className={clsx("w-full md:w-1/2 h-1/2 md:h-full relative order-1 md:order-2 flex items-center justify-center p-6 md:p-12", bgColor)}>
                  <div className="relative w-full max-w-[280px] md:max-w-[380px] aspect-[2/3] brutal-box rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons (Only if > 1 item) */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-[25%] md:top-1/2 -translate-y-1/2 z-20 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-yellow active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 text-black" strokeWidth={3} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-[25%] md:top-1/2 -translate-y-1/2 z-20 p-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-pink active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 text-black" strokeWidth={3} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-white border-[3px] border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={clsx(
                  "h-4 rounded-none transition-all duration-300 border-[2px] border-black",
                  i === currentIndex ? "w-8 bg-black" : "w-4 bg-white hover:bg-gray-200"
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
