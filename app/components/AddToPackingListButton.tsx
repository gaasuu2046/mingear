// components/AddToPackingListButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AddToPackingListButton({ gearId }: { gearId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleAddToPackingList = async () => {
    if (!session) {
      // ユーザーがログインしていない場合、ログインページにリダイレクト
      router.push('/api/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/packing-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gearId }),
      })

      if (response.ok) {
        // 成功した場合の処理（例：マイパッキングリストページへのリダイレクト）
        router.push('/my-packing-list')
      } else {
        // エラーハンドリング
        console.error('Failed to add to packing list')
      }
    } catch (error) {
      console.error('Error adding to packing list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToPackingList}
      disabled={isLoading}
      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
    >
      {isLoading ? 'Adding...' : 'マイパッキングリストに追加'}
    </button>
  )
}
