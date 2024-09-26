// app/api/search-trip/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { tripName } = await request.json();
  
  const response = await fetch('https://api.yamareco.com/api/v1/searchPoi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ page: '1', type_id: '0', name: tripName }),
  });
  
  const data = await response.json();
  
  if (data.poilist && data.poilist.length > 0) {
    const poiList = data.poilist.slice(0,5).map(poi => ({
      ptid: poi.ptid,
      name: poi.name,
      elevation: parseInt(poi.elevation),
      lat: parseFloat(poi.lat),
      lon: parseFloat(poi.lon),
      area: poi.area,
    }));
    return NextResponse.json(poiList);
  } else {
    return NextResponse.json([], { status: 200 });
  }
}
