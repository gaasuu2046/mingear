// app/api/packing-list/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { gearId } = await request.json()
  const userId = session.user.id

  try {
    const packingListItem = await prisma.packingList.create({
      data: { userId, gearId },
    })
    return NextResponse.json(packingListItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to packing list' }, { status: 500 })
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
      include: { gear: true },
    })
    return NextResponse.json(packingList)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packing list' }, { status: 500 })
  }
}
