// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { FaHome, FaList, FaStar, FaPlusCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

import type { Metadata } from 'next'

import { Providers } from '@/components/Providers'
import UserInfo from '@/components/UserInfo'
import {authOptions} from "@/lib/auth"


import './globals.css'

const inter = Noto_Sans_JP({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ウルトラライト！',
  description: 'UL愛好家のためのギアレビューサイト',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions) as Session | null
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-900 text-gray-100`}>
        <Providers>
          <header className="bg-gray-800 shadow-lg">
            <nav className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl mb-4 sm:mb-0 text-green-400">Rate Your Own Gear!</h1>
                <ul className="flex space-x-1 sm:space-x-4">
                  <NavItem href="/" icon={<FaHome />} text="ホーム" />
                  <NavItem href="/gear" icon={<FaList />} text="ギア一覧" />
                  <NavItem href="/reviews" icon={<FaStar />} text="レビュー" />
                  <NavItem href="/my-packing-list" icon={<FaList />} text="マイパッキングリスト" />
                  {session && <><NavItem href="/auth/profile" icon={<FaList />} text="プロフィール" /><NavItem href="/api/auth/signout" icon={<FaSignOutAlt />} text="ログアウト" /></>
                  }
                  {!session && <NavItem href="/auth/signin" icon={<FaSignInAlt />} text="ログイン" />}
                  <NavItem href="/gear/register" icon={<FaPlusCircle />} text="ギア登録" />
                </ul>
                <UserInfo session={session} />
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-gray-400 p-4 mt-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>&copy; 2024 ULギアレビューサイト. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}

function NavItem({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <li>
      <Link href={href} className="flex flex-col items-center p-2 hover:bg-gray-700 rounded transition duration-300">
        <span className="text-xl mb-1">{icon}</span>
        <span className="text-xs">{text}</span>
      </Link>
    </li>
  )
}
