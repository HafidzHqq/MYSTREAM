import { NextRequest, NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const data = await animeApi.completed(page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch completed anime' }, { status: 500 });
  }
}
