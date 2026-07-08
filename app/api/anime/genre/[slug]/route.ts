import { NextRequest, NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const data = await animeApi.genreAnime(slug, page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
  }
}
