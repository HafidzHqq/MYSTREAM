import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'home';
  const slug = searchParams.get('slug') || '';

  const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';
  const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://nekopoi.care/',
  };

  let url = `${BASE}/neko/home`;
  if (type === 'detail') url = `${BASE}/neko/detail/${slug}`;
  else if (type === 'episode') url = `${BASE}/neko/episode/${slug}`;
  else if (type === 'search') url = `${BASE}/neko/search?q=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      headers: defaultHeaders,
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Nekopoi API error', ok: false }, { status: 500 });
  }
}
