// app/api/packing-list/route.ts

import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import {authOptions} from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as Session | null

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
    console.error(error)
    return NextResponse.json({ error: 'Failed to add to packing list' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions) as Session | null
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
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch packing list' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { gearId } = await request.json()
  console.log('gearId', gearId)

  try {
    await prisma.packingList.delete({
      where: { id: gearId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to remove from packing list' }, { status: 500 })
  }
}
