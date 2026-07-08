import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { animeApi } from "@/lib/api/anime";
import { clsx } from "clsx";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Jadwal Rilis Anime - AniStream" };

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAY_EN = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface ScheduleAnime {
  slug?: string;
  title?: string;
  time?: string;
  day?: string;
}

interface ScheduleData {
  [key: string]: ScheduleAnime[] | undefined;
}

interface ApiResponse {
  data?: ScheduleData;
}

export default async function SchedulePage() {
  let scheduleData: ScheduleData = {};
  try {
    const res = await animeApi.schedule() as ApiResponse;
    scheduleData = res?.data || {};
  } catch { /* empty */ }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayIndex = DAY_EN.indexOf(today);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-accent-purple" />
            Jadwal Rilis Anime
          </h1>
          <p className="text-text-muted text-sm">Jadwal update episode anime mingguan</p>
        </div>

        <div className="space-y-6">
          {DAY_EN.map((dayEn, i) => {
            const animes = scheduleData[dayEn] || scheduleData[DAYS[i]] || [];
            const isToday = i === todayIndex;

            return (
              <div
                key={dayEn}
                className={clsx(
                  "rounded-2xl border overflow-hidden",
                  isToday
                    ? "border-accent-purple/30 bg-accent-purple/5"
                    : "border-white/5 bg-bg-card"
                )}
              >
                {/* Day Header */}
                <div className={clsx(
                  "flex items-center gap-3 px-6 py-4 border-b",
                  isToday ? "border-accent-purple/20" : "border-white/5"
                )}>
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    isToday ? "bg-accent-purple" : "bg-text-muted"
                  )} />
                  <h2 className={clsx(
                    "font-display font-bold text-lg",
                    isToday ? "text-accent-purple" : "text-text-primary"
                  )}>
                    {DAYS[i]}
                    {isToday && <span className="ml-2 text-xs font-normal text-accent-purple/70">(Hari ini)</span>}
                  </h2>
                  <span className="ml-auto text-xs text-text-muted">{animes.length} anime</span>
                </div>

                {/* Anime List */}
                {animes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4">
                    {(animes as ScheduleAnime[]).map((anime) => (
                      <Link
                        key={anime.slug}
                        href={`/anime/${anime.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary/50 border border-white/5 hover:border-accent-purple/30 hover:bg-bg-overlay transition-all group"
                      >
                        <div className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          isToday ? "bg-accent-purple/20" : "bg-white/5"
                        )}>
                          <Clock className={clsx("w-4 h-4", isToday ? "text-accent-purple" : "text-text-muted")} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary group-hover:text-accent-purple transition-colors line-clamp-1">
                            {anime.title}
                          </p>
                          {anime.time && (
                            <p className="text-xs text-text-muted">{anime.time}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-4 text-sm text-text-muted italic">
                    Tidak ada jadwal rilis
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
