import { NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET() {
  try {
    const [ongoing, akompi] = await Promise.allSettled([
      animeApi.ongoing(1),
      animeApi.akompiHome(),
    ]);

    return NextResponse.json({
      ongoing: ongoing.status === 'fulfilled' ? ongoing.value : null,
      featured: akompi.status === 'fulfilled' ? akompi.value : null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
