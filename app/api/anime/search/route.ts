import { NextRequest, NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [otakudesu, akompi] = await Promise.allSettled([
      animeApi.search(q),
      animeApi.akompiSearch(q),
    ]);

    return NextResponse.json({
      otakudesu: otakudesu.status === 'fulfilled' ? otakudesu.value : null,
      akompi: akompi.status === 'fulfilled' ? akompi.value : null,
    });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
