// app/api/packing-list/route.ts
import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import { Season } from '@/app/types/season'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// 新しい型定義
interface TripInfo {
  detail: string;
  season: Season;
}

interface ItemData {
  quantity: number;
  gearId?: string;
  personalGearId?: string;
}

interface RequestBody {
  name: string;
  detail: string;
  tripInfo: TripInfo;
  items: ItemData[];
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { name, detail, season,tripInfo }: RequestBody = await request.json()
  console.log("tripInfo", tripInfo)

  try {
    const packingList = await prisma.packingList.create({
      data: {
        name,
        userId: session.user.id,
        detail: detail || '',
        season: season,
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

// GET関数は変更なし

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { id }: { id: string } = await request.json()
  console.log('削除するアイテム:', id)
  try {
    await prisma.packingList.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの削除に失敗しました' }, { status: 500 })
  }
}
