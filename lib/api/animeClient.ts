const BASE = '/api/anime';

export async function fetchFromBrowser<T = unknown>(endpoint: string): Promise<T> {
  const url = `${BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
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
  // Default (proxied to Samehadaku in backend)
  home: () => fetchFromBrowser('/home'),
  ongoing: (page = 1) => fetchFromBrowser(`/ongoing?page=${page}`),
  completed: (page = 1) => fetchFromBrowser(`/completed?page=${page}`),
  search: (q: string) => fetchFromBrowser(`/search?q=${encodeURIComponent(q)}`),
  animeDetail: (slug: string) => fetchFromBrowser(`/detail/${slug}`),
  episodeDetail: (slug: string) => fetchFromBrowser(`/episode/${slug}`),
  genreList: () => fetchFromBrowser('/genre'),
  genreAnime: (slug: string, page = 1) => fetchFromBrowser(`/genre/${slug}?page=${page}`),
  schedule: () => fetchFromBrowser('/schedule'),
  
  // Specific Providers (if needed)
  akompiHome: () => fetchFromBrowser('/home?provider=akompi'),
  akompiSearch: (q: string) => fetchFromBrowser(`/search?q=${encodeURIComponent(q)}&provider=akompi`),
  akompiDetail: (slug: string) => fetchFromBrowser(`/detail/${slug}?provider=akompi`),
  akompiEpisode: (slug: string) => fetchFromBrowser(`/episode/${slug}?provider=akompi`),
  
  samehadakuHome: () => fetchFromBrowser('/home?provider=samehadaku'),
  samehadakuSearch: (q: string) => fetchFromBrowser(`/search?q=${encodeURIComponent(q)}&provider=samehadaku`),
  samehadakuDetail: (slug: string) => fetchFromBrowser(`/detail/${slug}?provider=samehadaku`),
  samehadakuEpisode: (slug: string) => fetchFromBrowser(`/episode/${slug}?provider=samehadaku`),
  
  donghuaHome: () => fetchFromBrowser('/home?provider=donghua'),
  donghuaSearch: (q: string) => fetchFromBrowser(`/search?q=${encodeURIComponent(q)}&provider=donghua`),
  donghuaDetail: (slug: string) => fetchFromBrowser(`/detail/${slug}?provider=donghua`),
  donghuaEpisode: (slug: string) => fetchFromBrowser(`/episode/${slug}?provider=donghua`),
};
