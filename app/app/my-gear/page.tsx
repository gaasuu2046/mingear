// app/my-gear/page.tsx

import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'

import PersonalGearList from './PersonalGearList'

import RefreshOnRedirect from '@/components/RefreshOnRedirect'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getPersonalGearList(userId: string) {
  const personalGearList = await prisma.personalGear.findMany({
    where: { userId },
    include: { 
      category: true, 
      brand: true 
    },
  })
  return personalGearList
}

export default async function MyGearPage() {
  const session = await getServerSession(authOptions) as Session | null
  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">所有ギア一覧を表示するにはログインしてください。</p>
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

  const personalGearList = await getPersonalGearList(session.user.id)

  return (
    <div className="container px-2 py-8">
      <RefreshOnRedirect />
      <h1 className="text-3xl font-bold mb-6">所有ギア一覧</h1>
      <PersonalGearList initialGearList={personalGearList} />
    </div>
  )
}
