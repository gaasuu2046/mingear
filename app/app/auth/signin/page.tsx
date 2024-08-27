// app/auth/signin/page.tsx
'use client'

import Image from 'next/image'
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'


export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (res?.error) {
        setError('Invalid credentials')
      } else {
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError('An unexpected error happened')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
        </div>
        <h3 className="text-2xl font-bold text-white text-center">ログイン</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-300" htmlFor="email">メールアドレス</label>
              <input
                type="text"
                placeholder="メールアドレス"
                className="w-full px-4 py-2 mt-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-300" htmlFor="password">パスワード</label>
              <input
                type="password"
                placeholder="パスワード"
                className="w-full px-4 py-2 mt-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">ログイン</button>
              <Link href="/auth/signup" className="text-sm text-blue-400 hover:underline">新規登録はこちら</Link>
            </div>
            {/* <a href="#" className="text-sm text-blue-400 text-center hover:underline">パスワードを忘れた方</a> */}
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
