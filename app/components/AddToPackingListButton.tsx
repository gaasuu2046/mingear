// components/AddToPackingListButton.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useCallback} from 'react'

interface AddToPackingListButtonProps {
  gearId: number;
  type: 'public' | 'personal';
  className?: string; 
}

export default function AddToPackingListButton({ gearId, type, className }:  AddToPackingListButtonProps ) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
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
        body: JSON.stringify({ 
          gearId: type === 'public' ? gearId : undefined,
          personalGearId: type === 'personal' ? gearId : undefined,
          type
         }),
      })

      if (response.ok) {
        // 成功した場合の処理
        setIsAdded(true)
      } else {
        // エラーハンドリング
        throw new Error('Failed to packing list')        
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('パッキングリストの登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClosePopup = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsAdded(false)
    }
  }, [])

  if (isAdded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleClosePopup}>
      <div className="bg-white p-4 rounded shadow-lg text-center">
        <p className="text-green-600 mb-2">パッキングリストに追加されました！</p>
        <Link href="/my-packing-list" className="text-blue-500 hover:underline">
          パッキングリストを見る
        </Link>
      </div>
    </div>
    )
  }
  return (
    <button
      onClick={handleAddToPackingList}
      disabled={isLoading}
      className={`text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors ${className || ''}`}
    >
      {isLoading ? 'Adding...' : 'パッキングリストに追加'}
    </button>
  )
}
