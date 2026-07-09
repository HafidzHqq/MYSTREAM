import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider') || 'otakudesu';
  const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';
  
  try {
    const endpoint = provider === 'otakudesu' 
      ? `${BASE}/server/${id}` 
      : `${BASE}/${provider}/server/${id}`;

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://otakudesu.cloud/',
      },
      next: { revalidate: 600 },
    });
    
    if (!res.ok) throw new Error();
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to resolve video server url' }, { status: 404 });
  }
}
