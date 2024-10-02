// app/packing-list/[id]/page.tsx
import { getServerSession } from 'next-auth/next'

import PackingListDetail from './PackingListDetail'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function PackingListPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return <div>認証が必要です</div>
  }

  const id = parseInt(params.id, 10)
  if (isNaN(id)) {
    return <div>無効なIDです</div>
  }

  const packingList = await prisma.packingList.findUnique({
    where: { id },
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
      likes: true,
      trips: true,
    },
  })

  

  if (!packingList) {
    return <div>パッキングリストが見つかりません</div>
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  })

  return (
    <PackingListDetail
      packingList={packingList}
      trips={trips}
      currentUserId={session.user.id}
    />
  )
}
