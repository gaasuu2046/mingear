// app/api/packing-lists/[id]/like/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const packingListId = parseInt(params.id)

  try {
    const like = await prisma.packingListLike.create({
      data: {
        userId: session.user.id,
        packingListId,
      },
    })

    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to like packing list' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const packingListId = parseInt(params.id)

  try {
    await prisma.packingListLike.delete({
      where: {
        userId_packingListId: {
          userId: session.user.id,
          packingListId,
        },
      },
    })

    return NextResponse.json({ message: 'Like removed' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 })
  }
}
