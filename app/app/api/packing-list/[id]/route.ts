import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { PackingListItem } from '@/app/my-packing-list/types'  // 型定義をインポート
import { SEASONS, Season } from '@/app/types/season'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface UpdatePackingListRequest {
  id: number;
  name: string;
  detail?: string;
  season: Season;
  items?: Omit<PackingListItem, 'id'>[];
  tripId?: string;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { name, detail, season, items, tripId }: UpdatePackingListRequest = await request.json()
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 })
  }

  if (season && !SEASONS.some(s => s.en === season)) {
    return NextResponse.json({ error: '無効なシーズンです' }, { status: 400 })
  }

  try {
    const packingList = await prisma.$transaction(async (prisma) => {
      let updatedList;

      if (items) {
        // ギアの更新がある場合
        await prisma.packingListItem.deleteMany({
          where: { packingListId: id }
        });

        updatedList = await prisma.packingList.update({
          where: { id },
          data: {
            name,
            detail,
            season,
            trips: tripId ? { connect: { id: parseInt(tripId, 10) } } : undefined,
            items: {
              create: items.map((item) => ({
                quantity: item.quantity || 1,
                gearId: item.gear?.id,
                personalGearId: item.personalGear?.id,
                altName: item.altName,
                altWeight: item.altWeight,
                altCategoryId: item.altCategoryId,
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
            likes: true,
            trips: true,
          },
        });
      } else {
        // ギアの更新がない場合（パッキングリストの基本情報のみ更新）
        updatedList = await prisma.packingList.update({
          where: { id },
          data: {
            name,
            detail,
            season,
            trips: tripId ? { connect: { id: parseInt(tripId, 10) } } : undefined,
          },
          include: {
            items: {
              include: {
                gear: true,
                personalGear: true,
              },
            },
            likes: true,
            trips: true,
          },
        });
      }

      return updatedList;
    });

    return NextResponse.json(packingList, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの更新に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 })
  }

  try {
    const packingList = await prisma.packingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
        likes: true,
        trips: true,
      },
    })

    if (!packingList) {
      return NextResponse.json({ error: 'パッキングリストが見つかりません' }, { status: 404 })
    }

    if (packingList.userId !== session.user.id) {
      return NextResponse.json({ error: 'アクセス権限がありません' }, { status: 403 })
    }

    return NextResponse.json(packingList, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの取得に失敗しました' }, { status: 500 })
  }
}