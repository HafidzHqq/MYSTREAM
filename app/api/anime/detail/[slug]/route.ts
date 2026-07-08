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
      data = await animeApi.akompiDetail(slug);
    } else if (provider === 'samehadaku') {
      data = await animeApi.samehadakuDetail(slug);
    } else {
      data = await animeApi.animeDetail(slug);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
  }
}
