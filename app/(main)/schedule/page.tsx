"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Play, CalendarDays } from "lucide-react";
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
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 p-[1px] shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-pink-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight">
                Jadwal Rilis Anime
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Jadwal rilis episode terbaru anime ongoing mingguan.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
                <div className="h-8 w-48 skeleton rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-24 skeleton rounded-xl" />
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
                  className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
                    isToday
                      ? "glass-panel border-accent-blue/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                      : "glass border-white/5"
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Calendar className={`w-7 h-7 ${isToday ? "text-accent-blue" : "text-text-muted"}`} />
                      Hari {dayData.day}
                    </h2>
                    {isToday && (
                      <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
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
                          className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div className="min-w-0 flex-1 mr-4">
                            <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors truncate text-base mb-2">
                              {anime.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              {anime.time && (
                                <span className="text-xs text-text-muted flex items-center gap-1.5 font-medium bg-black/30 px-2.5 py-1 rounded-md border border-white/5">
                                  <Clock className="w-3.5 h-3.5 text-accent-yellow" /> {anime.time}
                                </span>
                              )}
                              {anime.episode && (
                                <span className="text-xs text-white font-bold bg-accent-purple/20 border border-accent-purple/30 px-2.5 py-1 rounded-md">
                                  {anime.episode}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-accent-blue group-hover:border-accent-blue group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
                            <Play className="w-5 h-5 text-text-muted group-hover:text-white group-hover:fill-white ml-0.5 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-text-muted font-medium">Tidak ada rilis terjadwal untuk hari ini.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Data Jadwal Kosong</h3>
            <p className="text-text-muted text-lg max-w-md">Koneksi ke server bermasalah atau data kosong. Silakan periksa jaringan internet Anda.</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5 hover:border-white/20">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
