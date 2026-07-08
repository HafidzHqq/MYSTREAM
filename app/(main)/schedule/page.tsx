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
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-2">
            📅 Jadwal Rilis Anime
          </h1>
          <p className="text-text-muted text-sm">Jadwal rilis episode terbaru anime ongoing mingguan</p>
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-bg-card border border-white/5 space-y-4">
                <div className="h-6 w-32 skeleton rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-16 skeleton rounded-xl" />
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
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    isToday
                      ? "bg-gradient-to-br from-accent-purple/10 to-accent-pink/5 border-accent-purple/30 shadow-[0_4px_20px_rgba(139,92,246,0.15)]"
                      : "bg-bg-card border-white/5"
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                      <Calendar className={`w-5 h-5 ${isToday ? "text-accent-purple" : "text-text-muted"}`} />
                      Hari {dayData.day}
                    </h2>
                    {isToday && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent-purple text-white shadow-glow animate-pulse">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Anime List Grid */}
                  {dayData.animeList && dayData.animeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dayData.animeList.map((anime) => (
                        <Link
                          key={anime.slug}
                          href={`/anime/${anime.slug}`}
                          className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-accent-purple/30 hover:bg-bg-overlay transition-all group"
                        >
                          <div className="min-w-0 flex-1 mr-3">
                            <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent-purple transition-colors truncate">
                              {anime.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5">
                              {anime.time && (
                                <span className="text-[10px] text-text-muted flex items-center gap-1 font-semibold">
                                  <Clock className="w-3 h-3 text-accent-purple" /> {anime.time}
                                </span>
                              )}
                              {anime.episode && (
                                <span className="text-[10px] text-accent-purple font-extrabold uppercase">
                                  {anime.episode}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/20 transition-all">
                            <Play className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent-purple transition-colors fill-current" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted italic">Tidak ada rilis terjadwal untuk hari ini.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">📅 Data jadwal rilis tidak dapat dimuat.</p>
            <p className="text-sm mt-1">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
