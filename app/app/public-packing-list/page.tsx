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
      trip: true,
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
      likes: {
        _count: 'desc',
      },
    },
    take: 50,
  })
}

export default async function PublicPackingLists() {
  const session = await getServerSession(authOptions)
  const packingLists = await getPublicPackingLists()
  return <PublicPackingListsClient packingLists={packingLists} currentUserId={session?.user?.id} />
}
