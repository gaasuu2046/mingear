// app/api/packing-list/route.ts
import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { name, tripName, items } = await request.json()

  try {
    // 山行・登山計画の検索と作成
    const tripResponse = await fetch('https://api.yamareco.com/api/v1/searchPoi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        page: '1',
        type_id: '0',
        name: tripName,
      }),
    })

    const tripData = await tripResponse.json()
    let trip

    if (tripData.poilist && tripData.poilist.length > 0) {
      const poi = tripData.poilist[0]
      trip = await prisma.trip.create({
        data: {
          name: poi.name,
          ptid: poi.ptid,
          elevation: parseInt(poi.elevation),
          lat: parseFloat(poi.lat),
          lon: parseFloat(poi.lon),
          userId: session.user.id,
          area: poi.area || '不明',
          season: getSeason(new Date()),
        },
      })
    } else {
      trip = await prisma.trip.create({
        data: {
          name: tripName,
          userId: session.user.id,
          area: '不明',
          season: getSeason(new Date()),
        },
      })
    }

    const packingList = await prisma.packingList.create({
      data: {
        name,
        userId: session.user.id,
        tripId: trip.id,
        items: {
          create: items.map((item: any) => ({
            gearId: item.gearId,
            personalGearId: item.personalGearId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
        trip: true,
      },
    })

    return NextResponse.json(packingList, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの作成に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const packingLists = await prisma.packingList.findMany({
      where: userId ? { userId } : {},
      include: {
        user: {
          select: { name: true, image: true },
        },
        trip: true,
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(packingLists, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの取得に失敗しました' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { id } = await request.json()
  console.log('削除するアイテム:', id)
  try {
    await prisma.packingList.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの削除に失敗しました' }, { status: 500 })
  }
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (3 <= month && month <= 5) return '春';
  if (6 <= month && month <= 8) return '夏';
  if (9 <= month && month <= 11) return '秋';
  return '冬';
}

// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions) as Session | null

//   if (!session || !session.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }
//   const { gearId, personalGearId, type } = await request.json()
//   const userId = session.user.id

//   try {
//     let packingListItem;
//     if (type === 'public') {
//       packingListItem = await prisma.packingList.create({
//         data: { 
//           userId,
//           gearId
//         },
//         include: {
//           gear: {
//             include: {
//               category: true
//             }
//           }
//         }
//       })
//     } else if (type === 'personal') {
//       packingListItem = await prisma.packingList.create({
//         data: { 
//           userId, 
//           personalGearId: personalGearId
//         },
//         include: {
//           personalGear: {
//             include: {
//               category: true
//             }
//           }
//         }
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid gear type' }, { status: 400 })
//     }
//     return NextResponse.json(packingListItem, { status: 201 })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: 'Failed to add to packing list' }, { status: 500 })
//   }
// }
// export async function GET() {
//   const session = await getServerSession(authOptions) as Session | null
//   if (!session || !session.user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const userId = session.user.id

//   try {
//     const packingList = await prisma.packingList.findMany({
//       where: { userId },
//       include: { 
//         gear: true,
//         personalGear: true
//       },
//     })
//     return NextResponse.json(packingList, { 
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store, max-age=0',
//       }
//     })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: 'Failed to fetch packing list' }, { status: 500 })
//   }
// }
