import { NextRequest, NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') || 'otakudesu';

  try {
    let data;
    if (provider === 'akompi') {
      data = await animeApi.akompiEpisode(slug);
    } else if (provider === 'samehadaku') {
      data = await animeApi.samehadakuEpisode(slug);
    } else {
      data = await animeApi.episodeDetail(slug);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  }
}
