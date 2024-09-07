import Image from 'next/image'
import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import DeleteButton from './DeleteButton'
import DeleteMessageHandler from './DeleteMessageHandler'

import RefreshOnRedirect from '@/components/RefreshOnRedirect'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getPackingList(userId: string) {
  const packingList = await prisma.packingList.findMany({
    where: { userId },
    include: { 
      gear: {
        include: { category: true }
      },
      personalGear: {
        include: { category: true }
      }
    },
  })
  return packingList
}

export default async function MyPackingList() {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">パッキングレシピを利用するにはログインしてください。</p>
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
  const totalWeight = packingList.reduce((acc, item) => acc + (item.gear?.weight || item.personalGear?.weight || 0), 0)

  // ギアをカテゴリ毎にグループ化
  const gearByCategory = packingList.reduce((acc, item) => {
    const category = item.gear?.category?.name || item.personalGear?.category?.name || '未分類'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof packingList>)

  return (
    <div className="container mx-auto px-4 py-3">
      <RefreshOnRedirect />
      <DeleteMessageHandler />
      <h1 className="text-3xl font-bold mb-5">パッキングレシピ</h1>
      {/* <PackingListSearch /> */}
      <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-lg shadow-lg p-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">総重量</h2>
            <p className="text-4xl font-bold text-white">
              {(totalWeight / 1000).toFixed(2)}
              <span className="text-2xl ml-2">kg</span>
            </p>
          </div>
          <div className="text-white opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
        <h3 className="text-xl font-semibold mb-2 text-green-400">アイテムの追加方法</h3>
        <ul className="list-disc list-inside text-gray-300">
          <li>
            <Link href="/my-gear" className="text-blue-400 hover:underline">
              所有ギア一覧
            </Link>
            から追加する
          </li>
          <li>
            <Link href="/" className="text-blue-400 hover:underline">
              ギアカタログ
            </Link>
            から追加する
          </li>
        </ul>
        <p className="text-gray-300 mt-2">
          各アイテムの詳細ページで「パッキングレシピに追加」ボタンをクリックしてください。
        </p>
      </div>
      {Object.entries(gearByCategory).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => {
              const gear = item.gear || item.personalGear
              return (
                <div key={item.id} className="border rounded-lg p-4 shadow-sm">
                  <Link href={`/gear/${gear?.id}`}>
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                        <Image
                          src={gear?.img || '/logo.png'}
                          alt={gear?.name || 'Gear Image'}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <h3 className="text-xl font-semibold">{gear?.name}</h3>
                  </Link>
                  <p className="text-gray-600">重量: {gear?.weight || '不明'}g</p>
                  <DeleteButton id={item.id} />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
