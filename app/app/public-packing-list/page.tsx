// app/public-packing-lists/page.tsx
import { getServerSession } from 'next-auth/next'

import PublicPackingListsClient from './PublicPackingListsClient'

import { PackingList } from '@/app/public-packing-list/types';
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getPublicPackingLists(): Promise<Omit<PackingList, 'tripId' | 'isLikedByCurrentUser'>[]> {

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
  const packingListsWithLikeStatus: PackingList[] = packingLists.map(list => ({
    ...list,
    isLikedByCurrentUser: list.likes.some(like => like.userId === currentUserId),
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
    tripId: list.trips[0]?.id, // オプショナルチェーンを使用
  }));


  return <PublicPackingListsClient packingLists={packingListsWithLikeStatus} currentUserId={currentUserId} />
}
