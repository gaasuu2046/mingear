import Link from 'next/link'
import { getServerSession } from "next-auth/next"

import DeleteAccountButton from '../components/DeleteAccountButton'

import { authOptions } from "@/lib/auth"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-4">アクセスが拒否されました</h1>
          <p className="mb-4">このページを表示するにはログインが必要です。</p>
          <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded transition duration-300">
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-400">プロフィール</h1>
        <div className="space-y-4 mb-8">
          <div className="flex items-center border-b border-gray-700 pb-2">
            <span className="font-semibold w-1/3">名前:</span>
            <span className="w-2/3">{session.user.name}</span>
          </div>
          <div className="flex items-center border-b border-gray-700 pb-2">
            <span className="font-semibold w-1/3">メールアドレス:</span>
            <span className="w-2/3">{session.user.email}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/api/auth/signout" 
            className="bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded transition duration-300 text-center"
          >
            ログアウト
          </Link>
          
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  )
}
