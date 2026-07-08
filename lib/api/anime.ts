const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'Referer': 'https://otakudesu.cloud/',
  'Origin': 'https://otakudesu.cloud',
};

export async function fetchAnime<T = unknown>(
  endpoint: string,
  revalidate = 300
): Promise<T> {
  const url = `${BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: defaultHeaders,
      next: { revalidate },
    });
    
    // Jangan throw error langsung agar web Next.js tidak crash (500) saat API luar down/404.
    // Cukup kembalikan objek kosong/null.
    if (!res.ok) {
      console.warn(`[AnimeAPI] HTTP Warning ${res.status} on URL: ${url}`);
      return {} as T;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error('[AnimeAPI] Fetch Exception:', err);
    return {} as T;
  }
}

// ─── Endpoint Helpers ───────────────────────────────────────────────────────

export const animeApi = {
  // Home / Ongoing / Completed (Otakudesu)
  home: () => fetchAnime('/home'),
  ongoing: (page = 1) => fetchAnime(`/ongoing-anime?page=${page}`),
  completed: (page = 1) => fetchAnime(`/complete-anime?page=${page}`),

  // Search
  search: (q: string) => fetchAnime(`/search?q=${encodeURIComponent(q)}`),

  // Detail
  animeDetail: (slug: string) => fetchAnime(`/anime/${slug}`),
  episodeDetail: (slug: string) => fetchAnime(`/episode/${slug}`),

  // Genre
  genreList: () => fetchAnime('/genres'),
  genreAnime: (slug: string, page = 1) => fetchAnime(`/genres/${slug}?page=${page}`),

  // Schedule
  schedule: () => fetchAnime('/schedule'),

  // Animekompi (for rich thumbnails)
  akompiHome: () => fetchAnime('/akompi/home'),
  akompiSearch: (q: string) => fetchAnime(`/akompi/search?q=${encodeURIComponent(q)}`),
  akompiDetail: (slug: string) => fetchAnime(`/akompi/detail/${slug}`),
  akompiEpisode: (slug: string) => fetchAnime(`/akompi/episode/${slug}`),

  // Samehadaku
  samehadakuHome: () => fetchAnime('/samehadaku/home'),
  samehadakuSearch: (q: string) => fetchAnime(`/samehadaku/search?q=${encodeURIComponent(q)}`),
  samehadakuDetail: (slug: string) => fetchAnime(`/samehadaku/detail/${slug}`),
  samehadakuEpisode: (slug: string) => fetchAnime(`/samehadaku/episode/${slug}`),

  // Donghua
  donghuaHome: () => fetchAnime('/donghua/home'),
  donghuaSearch: (q: string) => fetchAnime(`/donghua/search?q=${encodeURIComponent(q)}`),
  donghuaDetail: (slug: string) => fetchAnime(`/donghua/detail/${slug}`),
  donghuaEpisode: (slug: string) => fetchAnime(`/donghua/episode/${slug}`),
};
