// app/layout.tsx
import { Inconsolata } from 'next/font/google'
import Link from 'next/link'

import type { Metadata } from 'next'
import './globals.css'

const inter = Inconsolata({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ULギアレビューサイト',
  description: 'UL愛好家のためのギアレビューサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-green-700 text-white p-4">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl font-bold mb-4 sm:mb-0">ULギアレビュー</h1>
              <ul className="flex space-x-4">
                <li><Link href="/" className="hover:underline">ホーム</Link></li>
                <li><Link href="/gear" className="hover:underline">ギア一覧</Link></li>
                <li><Link href="/reviews" className="hover:underline">レビュー</Link></li>
              </ul>
            </div>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 ULギアレビューサイト. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
