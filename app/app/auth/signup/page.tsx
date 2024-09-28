'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        router.push('/auth/signin')
      } else {
        const data = await res.json()
        setError(data.error || 'An error occurred during signup')
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
        </div>
        <h3 className="text-2xl font-bold text-black text-center">新規登録</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-300" htmlFor="name">名前</label>
              <input
                type="text"
                placeholder="名前"
                className="w-full px-4 py-2 mt-2 border border-gray-600 bg-gray-700 text-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-300" htmlFor="email">メールアドレス</label>
              <input
                type="email"
                placeholder="メールアドレス"
                className="w-full px-4 py-2 mt-2 border border-gray-600 bg-gray-700 text-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                className="w-full px-4 py-2 mt-2 border border-gray-600 bg-gray-700 text-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-black bg-blue-600 rounded-lg hover:bg-blue-700">登録</button>
            </div>
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
