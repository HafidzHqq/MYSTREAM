const BASE = 'https://www.sankavollerei.web.id/anime';

export async function fetchFromBrowser<T = unknown>(endpoint: string): Promise<T> {
  const url = `${BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        // Headers ringan yang didukung CORS browser
        'Accept': 'application/json',
      }
    });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error('[AnimeClientAPI] Fail:', err);
    return [] as unknown as T;
  }
}

export const animeClientApi = {
  home: () => fetchFromBrowser('/home'),
  ongoing: (page = 1) => fetchFromBrowser(`/ongoing-anime?page=${page}`),
  completed: (page = 1) => fetchFromBrowser(`/complete-anime?page=${page}`),
  search: (q: string) => fetchFromBrowser(`/search?q=${encodeURIComponent(q)}`),
  animeDetail: (slug: string) => fetchFromBrowser(`/anime/${slug}`),
  episodeDetail: (slug: string) => fetchFromBrowser(`/episode/${slug}`),
  genreList: () => fetchFromBrowser('/genres'),
  genreAnime: (slug: string, page = 1) => fetchFromBrowser(`/genres/${slug}?page=${page}`),
  schedule: () => fetchFromBrowser('/schedule'),
  
  // Akompi
  akompiHome: () => fetchFromBrowser('/akompi/home'),
  
  // Samehadaku
  samehadakuHome: () => fetchFromBrowser('/samehadaku/home'),
  
  // Donghua
  donghuaHome: () => fetchFromBrowser('/donghua/home'),
  
  // Nekopoi
  nekoHome: () => fetchFromBrowser('/neko/home'),
  nekoEpisode: (slug: string) => fetchFromBrowser(`/neko/episode/${slug}`),
};
