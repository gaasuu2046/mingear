import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { PackingListItem } from '@/app/my-packing-list/types'
import { SEASONS, Season } from '@/app/types/season'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface UpdatePackingListRequest {
  id: number;
  name: string;
  detail?: string;
  season: Season;
  items?: Omit<PackingListItem, 'id'>[];
  trips: { id: number; name: string }[];  // tripsをオブジェクトの配列として受け取る
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { name, detail, season, items, trips }: UpdatePackingListRequest = await request.json()
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    console.log('id:', id)
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 })
  }

  if (season && !SEASONS.some(s => s.en === season)) {
    console.log('season:', season)
    return NextResponse.json({ error: '無効なシーズンです' }, { status: 400 })
  }

  try {

    const updateData: Prisma.PackingListUpdateInput = {}

    if (name !== undefined) updateData.name = name
    if (detail !== undefined) updateData.detail = detail
    if (season !== undefined) updateData.season = season

    // tripsが提供された場合のみ更新、そうでなければ既存の旅程を保持
    if (trips) {
      updateData.trips = {
        set: trips.map(trip => ({ id: trip.id })),
      }
    }

    if (items) {
      updateData.items = {
        deleteMany: {},
        create: items.map((item) => ({
          quantity: item.quantity || 1,
          gearId: item.gear?.id,
          personalGearId: item.personalGear?.id,
          altName: item.altName,
          altWeight: item.altWeight,
          altCategoryId: item.altCategoryId,
        })),
      }
    }

    const updatedPackingList = await prisma.packingList.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedPackingList, { status: 200 })
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id, 10);

  try {
    const packingList = await prisma.packingList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!packingList) {
      return NextResponse.json({ error: 'Packing list not found' }, { status: 404 });
    }

    if (packingList.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // トランザクションを使用して、関連するアイテムといいねとパッキングリストを削除
    await prisma.$transaction(async (prisma) => {
      // まず、関連する PackingListItem を削除
      await prisma.packingListItem.deleteMany({
        where: { packingListId: id },
      });

      await prisma.packingListLike.deleteMany({
        where: { packingListId: id },
      });
      
      // 次に、パッキングリストを削除
      await prisma.packingList.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting packing list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
