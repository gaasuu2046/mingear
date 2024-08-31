import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

import DeleteButton from './DeleteButton'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import RefreshOnRedirect from '@/components/RefreshOnRedirect'
import prisma from '@/lib/prisma'

async function getPackingList(userId: string) {
  const packingList = await prisma.packingList.findMany({
    where: { userId },
    include: { gear: true },
  })
  return packingList
}

export default async function MyPackingList() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    // /api/auth/signin にリダイレクト
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">パッキングリストを表示するにはログインしてください。</p>
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
  const totalWeight = packingList.reduce((acc, item) => acc + (item.gear.weight || 0), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <RefreshOnRedirect />
      <h1 className="text-3xl font-bold mb-6">マイパッキングリスト</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packingList.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            <Image
              src={item.gear.img}
              alt={item.gear.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{item.gear.name}</h2>
            <p className="text-gray-600">重量: {item.gear.weight}g</p>
            <DeleteButton gearId={item.id} />
          </div>
        ))}
      </div>
      <div className="mt-8 text-xl font-semibold text-black">
        総重量: {totalWeight}g
      </div>
    </div>
  )
}
