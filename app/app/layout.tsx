// app/layout.tsx
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { FaHome, FaList, FaStar, FaPlusCircle } from 'react-icons/fa'

import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ウルトラライト！',
  description: 'UL愛好家のためのギアレビューサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-900 text-gray-100`}>
        <header className="bg-gray-800 shadow-lg">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold mb-4 sm:mb-0 text-green-400">ULギアレビュー</h1>
              <ul className="flex space-x-1 sm:space-x-4">
                <NavItem href="/" icon={<FaHome />} text="ホーム" />
                <NavItem href="/gear" icon={<FaList />} text="ギア一覧" />
                <NavItem href="/reviews" icon={<FaStar />} text="レビュー" />
                <NavItem href="/gear/register" icon={<FaPlusCircle />} text="ギア登録" />
              </ul>
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
