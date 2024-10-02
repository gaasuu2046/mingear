// app/public-packing-lists/page.tsx
import { getServerSession } from 'next-auth/next'

import PublicPackingListsClient from './PublicPackingListsClient'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getPublicPackingLists() {
  
  return await prisma.packingList.findMany({
    include: { 
      user: {
        select: { name: true, image: true },
      },
      trips: true,
      items: {
        include: {
          gear: {
            include: {
              brand: true 
            }
          },
          personalGear: true,
        },
      },
      likes: true,
      _count: {
        select: { likes: true },
      },
    },
    orderBy: {
      likes: {
        _count: 'desc',
      },
    },
    take: 50,
  })
}


export default async function PublicPackingLists() {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id
  const packingLists = await getPublicPackingLists()
  const packingListsWithLikeStatus = packingLists.map(list => ({
    ...list,
    isLikedByCurrentUser: list.likes.some(like => like.userId === currentUserId),
    createdAt: list.createdAt.toISOString(),
    updatedAt: list.updatedAt.toISOString()
  }))
  
  return <PublicPackingListsClient packingLists={packingListsWithLikeStatus} currentUserId={currentUserId} />
}
