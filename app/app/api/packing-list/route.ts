// app/api/packing-list/route.ts
import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import { Season } from '@/app/types/season'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface TripInfo {
  id: number;
}

interface RequestBody {
  name: string;
  detail: string;
  season: Season;
  trips: TripInfo[];
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { name, detail, season, trips }: RequestBody = await request.json()
  console.log("Received trips:", trips)

  try {
    const packingList = await prisma.packingList.create({
      data: {
        name,
        userId: session.user.id,
        detail: detail || '',
        season,
        trips: {
          connect: trips.map(trip => ({ id: trip.id }))
        },
      },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
        trips: true,
      },
    })

    return NextResponse.json(packingList, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'パッキングリストの作成に失敗しました' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id
  try {
    const packingList = await prisma.packingList.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true,
          },
        },
        trips: true,
      },
    })
    return NextResponse.json(packingList)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch packing list' }, { status: 500 })
  }
}

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
