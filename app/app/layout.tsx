// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { FaList, FaListAlt, FaStar, FaUser, FaPlusCircle } from 'react-icons/fa'
import { GrCatalog } from 'react-icons/gr'


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
  description: 'UL愛好家のためのULハイカー/登山者向けのコミュニティーサイト',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions) as Session | null
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-900 text-gray-800`}>
        <Providers>
          <header className="bg-gray-800 text-gray-100 shadow-lg">
          <nav className="container mx-auto px-1 py-2 sm:px-2 sm:py-3 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl mb-0 sm:mb-0 text-green-400">Rate Your Own Gear!</h1>
                <ul className="flex text-xs sm:text-sm whitespace-nowrap">
                  <NavItem href="/gear" icon={<GrCatalog />} text="ギアカタログ" />
                  <NavItem href="/my-packing-list" icon={<FaListAlt />} text="パッキングリスト" />
                  <NavItem href="/public-packing-list" icon={<GrCatalog />} text="みんなのパッキング" />
                  <NavItem href="/my-gear" icon={<FaList />} text="所有ギア" />
                  <NavItem href="/gear/register" icon={<FaPlusCircle />} text="ギア登録" />
                  <NavItem href="/reviews" icon={<FaStar />} text="レビュー" />
                </ul>
                <div className="flex items-center space-x-4">
                  <UserInfo session={session} />
                  {session ? (
                    <Link href="/auth/profile" className="text-gray-300 hover:text-black">
                      <FaUser />
                    </Link>
                  ) : (
                    <Link href="/auth/signin" className="text-gray-300 hover:text-black">
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
              <p>&copy; 2024 ULハイカー/登山者向けのコミュニティーサイト. All rights reserved.</p>
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
