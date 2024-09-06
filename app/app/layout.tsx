// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { FaList, FaStar, FaUser } from 'react-icons/fa'

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
          <nav className="container mx-auto px-2 py-2 sm:px-4 sm:py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl mb-4 sm:mb-0 text-green-400">Rate Your Own Gear!</h1>
                <ul className="flex space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <NavItem href="/" icon={<FaList />} text="ギア一覧" />
                  {/* <NavItem href="/gear" icon={<FaList />} text="ギア一覧" /> */}
                  <NavItem href="/my-packing-list" icon={<FaList />} text="パッキングレシピ" />
                  <NavItem href="/my-gear" icon={<FaList />} text="所有ギア" />
                  <NavItem href="/reviews" icon={<FaStar />} text="レビュー" />
                </ul>
                <div className="flex items-center space-x-4">
                  <UserInfo session={session} />
                  {session ? (
                    <Link href="/auth/profile" className="text-gray-300 hover:text-white">
                      <FaUser />
                    </Link>
                  ) : (
                    <Link href="/auth/signin" className="text-gray-300 hover:text-white">
                      ログイン
                    </Link>
                  )}
                </div>
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
