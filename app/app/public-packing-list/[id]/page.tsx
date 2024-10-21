// app/packing-list/[id]/page.tsx
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

import PackingListDetail from './PackingListDetail'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function PackingListPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">パッキングリストの詳細を閲覧するにはログインしてください。</p>
          <Link
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded transition duration-300"
          >
            ログインページへ
          </Link>
        </div>
      </div>)
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
      _count: true,
    },
  })



  if (!packingList) {
    return <div>パッキングリストが見つかりません</div>
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, packingListId: true, detail: true, ptid: true, elevation: true, area: true, startDate: true, endDate: true },
  })

  return (
    <PackingListDetail
      packingList={packingList}
      trips={trips}
      currentUserId={session.user.id}
    />
  )
}
