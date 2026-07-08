import { NextResponse } from 'next/server';
import { animeApi } from '@/lib/api/anime';

export async function GET() {
  try {
    const data = await animeApi.schedule();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}
