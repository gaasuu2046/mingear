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
    const poi = data.poilist[0];
    return NextResponse.json({
      name: poi.name,
      elevation: poi.elevation,
      area: poi.area,
      season: getSeason(new Date()), // 現在の季節を取得する関数
    });
  } else {
    return NextResponse.json({ error: '山行情報が見つかりませんでした' }, { status: 404 });
  }
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (3 <= month && month <= 5) return '春';
  if (6 <= month && month <= 8) return '夏';
  if (9 <= month && month <= 11) return '秋';
  return '冬';
}
