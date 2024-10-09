// app/layout.tsx
import { Noto_Sans_JP } from 'next/font/google'
import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { Suspense } from 'react';
import { FaList, FaListAlt, FaUser, FaPlusCircle } from 'react-icons/fa'
import { FaMountainSun } from "react-icons/fa6";
import { GrCatalog } from 'react-icons/gr'

import type { Metadata } from 'next'

import LoadingSpinner from '@/components/LoadingSpinner'
import { Providers } from '@/components/Providers'
import UserInfo from '@/components/UserInfo'
import { authOptions } from "@/lib/auth"

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
            <div className="container mx-auto sm:px-6 lg:px-8">
              <nav className="flex justify-between items-center py-2">
                <h1 className="text-xl sm:text-2xl ml-2 text-green-400">Rate Your Own Gear!</h1>
                <div className="flex flex-wrap text-[10px] sm:text-xs gap-2 sm:gap-4">
                  <UserInfo session={session} />
                  {session ? (
                    <Link href="/auth/profile" className="text-gray-300 hover:text-white mr-2">
                      <FaUser />
                    </Link>
                  ) : (
                    <Link href="/auth/signin" className="text-gray-300 hover:text-white">
                      ログイン
                    </Link>
                  )}
                </div>
              </nav>
              <nav className="relative">
                <div className="overflow-x-auto">
                  <ul className="flex text-xs sm:text-sm gap-4 sm:gap-4" style={{ width: 'max-content' }}>
                    {[
                      { href: "/public-packing-list", icon: <GrCatalog />, text: "みんなのパッキング" },
                      { href: "/my-packing-list", icon: <FaListAlt />, text: "マイパッキング" },
                      { href: "/trips", icon: <FaMountainSun />, text: "マイトリップ" },
                      { href: "/gear", icon: <GrCatalog />, text: "ギア探索" },
                      { href: "/my-gear", icon: <FaList />, text: "所有ギア" },
                      { href: "/gear/register", icon: <FaPlusCircle />, text: "ギア登録" }
                    ].map((item, index) => (
                      <li key={item.href} className={`flex-shrink-0 ${index < 4 ? 'w-20 sm:w-24' : ''}`}>
                        <NavItem href={item.href} icon={item.icon} text={item.text} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-gray-800 to-transparent pointer-events-none"></div>
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
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
    <Link href={href} className="flex flex-col items-center p-1 hover:bg-gray-700 rounded transition duration-300">
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-center text-[10px] break-words">{text}</span>
    </Link>
  );
}
