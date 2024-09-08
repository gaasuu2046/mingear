import { NextResponse } from 'next/server'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as Session | null

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { gearId, personalGearId, type } = await request.json()
  const userId = session.user.id

  try {
    let packingListItem;
    if (type === 'public') {
      packingListItem = await prisma.packingList.create({
        data: { 
          userId,
          gearId
        },
        include: {
          gear: {
            include: {
              category: true
            }
          }
        }
      })
    } else if (type === 'personal') {
      packingListItem = await prisma.packingList.create({
        data: { 
          userId, 
          personalGearId: personalGearId
        },
        include: {
          personalGear: {
            include: {
              category: true
            }
          }
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid gear type' }, { status: 400 })
    }
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
      include: { 
        gear: true,
        personalGear: true
      },
    })
    return NextResponse.json(packingList, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      }
    })
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

  const { id } = await request.json()
  console.log('Deleting item:', id)
  try {
    await prisma.packingList.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to remove from packing list' }, { status: 500 })
  }
}
