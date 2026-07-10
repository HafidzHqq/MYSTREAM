import { NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET() {
  try {
    const data = await animeApi.genreList();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
