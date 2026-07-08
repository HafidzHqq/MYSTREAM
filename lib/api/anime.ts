const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';

// Header yang disimulasikan mirip dengan browser Chrome asli untuk melewati Cloudflare
const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://otakudesu.cloud/',
  'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
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

    if (!res.ok) {
      console.warn(`[AnimeAPI] HTTP Warning ${res.status} on URL: ${url}`);
      return [] as unknown as T; // Kembalikan array kosong sebagai fallback aman
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error('[AnimeAPI] Fetch Exception:', err);
    return [] as unknown as T;
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
