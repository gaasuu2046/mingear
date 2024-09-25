import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import PackingListClient from './PackingListClient'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'



async function getPackingList(userId: string) {
  const packingList = await prisma.packingList.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          gear: {
            include: {
              category: true
            }
          },
          personalGear: {
            include: {
              category: true
            }
          }
        }
      },
      trip: true,
      user: true,
      likes: true
    }
  });
  return packingList
}

export default async function MyPackingList() {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">パッキングリストを利用するにはログインしてください。</p>
          <Link 
            href="/auth/signin" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  const packingList = await getPackingList(session.user.id)
  const totalWeight = packingList.reduce((acc, item) => 
    acc + (item.gear?.weight || item.personalGear?.weight || 0), 0
  )

  // ギアをカテゴリ毎にグループ化
  const gearByCategory = packingList.reduce((acc, item) => {
    const category = item.gear?.category?.name || item.personalGear?.category?.name || '未分類'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof packingList>)

  return <PackingListClient initialPackingLists={packingList} />
}
