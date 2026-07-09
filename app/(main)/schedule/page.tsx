"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Play } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface ScheduleAnime {
  title: string;
  slug: string;
  time?: string;
  episode?: string;
}

interface ScheduleDay {
  day: string;
  animeList: ScheduleAnime[];
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current day in Indonesian
  const indonesianDays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = indonesianDays[new Date().getDay()];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.schedule();
        const list = data?.data || data?.scheduleList || [];
        setSchedule(Array.isArray(list) ? list : []);
      } catch {
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 brutal-box bg-accent-pink p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-black text-black mb-2 uppercase tracking-tighter">
            📅 Jadwal Rilis Anime
          </h1>
          <p className="text-black font-bold text-lg border-l-4 border-black pl-3 bg-white/50 inline-block pr-4 py-1">
            Jadwal rilis episode terbaru anime ongoing mingguan
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="h-8 w-48 bg-gray-200 border-2 border-black animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 border-[3px] border-black animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : schedule.length > 0 ? (
          <div className="space-y-8">
            {schedule.map((dayData) => {
              const isToday = dayData.day.toLowerCase() === currentDayName.toLowerCase();
              return (
                <div
                  key={dayData.day}
                  className={`p-6 border-[3px] border-black brutal-box ${
                    isToday
                      ? "bg-accent-yellow shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-black uppercase flex items-center gap-3">
                      <Calendar className={`w-8 h-8 ${isToday ? "text-black" : "text-gray-700"} stroke-[3]`} />
                      Hari {dayData.day}
                    </h2>
                    {isToday && (
                      <span className="px-4 py-1 text-sm font-black uppercase tracking-wider bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Anime List Grid */}
                  {dayData.animeList && dayData.animeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {dayData.animeList.map((anime) => (
                        <Link
                          key={anime.slug}
                          href={`/anime/${anime.slug}`}
                          className="flex items-center justify-between p-4 bg-white border-[3px] border-black brutal-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-cyan group"
                        >
                          <div className="min-w-0 flex-1 mr-3">
                            <h3 className="font-black text-sm md:text-base text-black group-hover:underline underline-offset-2 truncate uppercase">
                              {anime.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              {anime.time && (
                                <span className="text-xs text-black flex items-center gap-1 font-bold border-2 border-black px-1.5 bg-gray-100 group-hover:bg-white">
                                  <Clock className="w-3.5 h-3.5 text-black stroke-[3]" /> {anime.time}
                                </span>
                              )}
                              {anime.episode && (
                                <span className="text-xs text-black font-black uppercase border-2 border-black px-1.5 bg-accent-pink">
                                  {anime.episode}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-accent-yellow border-[3px] border-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-black fill-black ml-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-black font-bold italic border-l-4 border-black pl-3 py-1">Tidak ada rilis terjadwal untuk hari ini.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-black brutal-box bg-white">
            <p className="text-2xl font-black uppercase mb-2">📅 Data jadwal rilis tidak dapat dimuat.</p>
            <p className="text-lg font-bold">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
