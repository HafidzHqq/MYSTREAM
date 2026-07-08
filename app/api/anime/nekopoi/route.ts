import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'home';
  const slug = searchParams.get('slug') || '';

  const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';
  
  // Emulasikan Chrome asli secara penuh agar melewati proteksi Cloudflare
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://nekopoi.care/',
    'Origin': 'https://nekopoi.care',
  };

  let url = `${BASE}/neko/home`;
  if (type === 'detail') url = `${BASE}/neko/detail/${slug}`;
  else if (type === 'episode') url = `${BASE}/neko/episode/${slug}`;
  else if (type === 'search') url = `${BASE}/neko/search?q=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`[NekopoiAPI] Warning ${res.status} on URL: ${url}`);
      return NextResponse.json({ data: [], warning: 'API returned non-ok status' });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[NekopoiAPI] Fail:', err);
    // Kembalikan objek data kosong agar UI website tetap sukses termuat tanpa error 500
    return NextResponse.json({ data: [], error: 'Failed to fetch from source' });
  }
}
