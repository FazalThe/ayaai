import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return Response.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.alquran.info/v1/prayer_times?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    
    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 500 });
    }
    
    return Response.json(data.data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prayer times' }, { status: 500 });
  }
}