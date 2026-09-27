"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Play, CalendarDays } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface ScheduleAnime {
  title: string;
  slug?: string;
  animeId?: string;
  time?: string;
  episode?: string;
  poster?: string;
  type?: string;
  score?: string;
  genres?: string;
}

interface ScheduleDay {
  day: string;
  animeList: ScheduleAnime[];
}

const dayTranslation: Record<string, string> = {
  "sunday": "Minggu",
  "monday": "Senin",
  "tuesday": "Selasa",
  "wednesday": "Rabu",
  "thursday": "Kamis",
  "friday": "Jumat",
  "saturday": "Sabtu"
};

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
        const list = data?.data?.days || data?.data || data?.scheduleList || [];
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
    <div className="min-h-screen py-8 bg-bg-primary">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1.5">
            <CalendarDays className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Jadwal Mingguan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Jadwal Rilis Anime
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Jadwal rilis episode terbaru anime ongoing mingguan.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl bg-bg-secondary/70 border border-white/[0.06] space-y-4">
                <div className="h-6 w-36 skeleton rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-20 skeleton rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : schedule.length > 0 ? (
          <div className="space-y-6">
            {schedule.map((dayData) => {
              const translatedDay = dayTranslation[dayData.day.toLowerCase()] || dayData.day;
              const isToday = translatedDay.toLowerCase() === currentDayName.toLowerCase();
              return (
                <div
                  key={dayData.day}
                  className={`p-5 sm:p-7 rounded-xl border transition-all duration-300 ${
                    isToday
                      ? "bg-bg-secondary/90 border-white/[0.14] shadow-lg"
                      : "bg-bg-secondary/60 border-white/[0.06]"
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-5 gap-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                      <Calendar className={`w-5 h-5 ${isToday ? "text-sky-400" : "text-text-muted"}`} />
                      <span>Hari {translatedDay}</span>
                    </h2>
                    {isToday && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-xl-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-xl-full bg-emerald-400 animate-pulse"></span>
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Anime List Grid */}
                  {dayData.animeList && dayData.animeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dayData.animeList.map((anime) => (
                        <Link
                          key={anime.slug || anime.animeId}
                          href={`/anime/${anime.slug || anime.animeId}`}
                          className="flex gap-3.5 p-2.5 rounded-xl bg-bg-card/70 hover:bg-bg-card border border-white/[0.06] hover:border-white/[0.16] transition-all duration-200 group hover:-translate-y-0.5"
                        >
                          {/* Poster Image */}
                          <div className="relative w-16 h-24 rounded-xl overflow-hidden shrink-0 border border-white/[0.08] bg-bg-secondary">
                            {anime.poster ? (
                              <img
                                src={anime.poster}
                                alt={anime.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-text-muted text-xs">
                                No Poster
                              </div>
                            )}
                            
                            {/* Score Tag */}
                            {anime.score && anime.score !== "0" && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xl bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/20">
                                ★ {anime.score}
                              </div>
                            )}
                          </div>

                          {/* Info Column */}
                          <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors line-clamp-2 text-sm leading-snug mb-1">
                                {anime.title}
                              </h3>
                              
                              {/* Genres */}
                              {anime.genres && (
                                <p className="text-[11px] text-text-secondary truncate mb-2">
                                  {anime.genres}
                                </p>
                              )}
                            </div>

                            {/* Badges/Info Row */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {anime.time && (
                                <span className="text-[11px] text-sky-300 font-medium flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-xl">
                                  <Clock className="w-3 h-3" /> {anime.time}
                                </span>
                              )}
                              {anime.episode && (
                                <span className="text-[11px] text-white/90 font-medium bg-white/[0.08] border border-white/[0.08] px-2 py-0.5 rounded-xl">
                                  {anime.episode}
                                </span>
                              )}
                              {anime.type && (
                                <span className="text-[11px] text-text-muted bg-white/[0.04] px-1.5 py-0.5 rounded-xl">
                                  {anime.type}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-bg-card/40 border border-white/[0.05] text-center">
                      <p className="text-text-muted text-sm">Tidak ada rilis terjadwal untuk hari ini.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6">
            <div className="w-14 h-14 mb-4 rounded-xl-full bg-white/[0.05] flex items-center justify-center border border-white/[0.08] text-2xl">
              📅
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Data Jadwal Kosong</h3>
            <p className="text-text-muted text-sm max-w-sm">Koneksi ke server bermasalah atau data jadwal belum tersedia.</p>
            <button onClick={() => window.location.reload()} className="mt-5 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
