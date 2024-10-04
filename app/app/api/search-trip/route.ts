// app/api/search-trip/route.ts
import { NextResponse } from 'next/server';

import { FormattedPoi, YamarecoPoiResponse} from '@/app/types/trips'


export async function POST(request: Request) {
  const { tripName }: { tripName: string } = await request.json();
  
  const response = await fetch('https://api.yamareco.com/api/v1/searchPoi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ page: '1', type_id: '0', name: tripName }),
  });
  
  const data: YamarecoPoiResponse = await response.json();
  
  if (data.poilist && data.poilist.length > 0) {
    const poiList: FormattedPoi[] = data.poilist.slice(0, 5).map(poi => ({
      ptid: poi.ptid,
      name: poi.name,
      elevation: parseInt(poi.elevation),
      lat: parseFloat(poi.lat),
      lon: parseFloat(poi.lon),
      area: poi.area,
    }));
    return NextResponse.json(poiList);
  } else {
    return NextResponse.json([] as FormattedPoi[], { status: 200 });
  }
}
