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

  const { name, tripInfo, items } = await request.json()
  console.log("tripInfo")
  console.log(tripInfo)
  try {
    const packingList = await prisma.packingList.create({
      data: {
        name,
        userId: session.user.id,
        detail: tripInfo.detail,
        season: tripInfo.season,
        items: {
          create: Array.isArray(items) ? items.map((item: any) => {
            const itemData: any = { quantity: item.quantity || 1 };
            if (item.gearId) itemData.gearId = item.gearId;
            if (item.personalGearId) itemData.personalGearId = item.personalGearId;
            return itemData;
          }) : [],
        },
      },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
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

