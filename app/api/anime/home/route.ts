import { NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET() {
  try {
    const data = await animeApi.home();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
