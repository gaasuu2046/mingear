// components/AddToPersonalGearButton.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useCallback } from 'react'

interface AddToPersonalGearButtonProps {
  gearId: number;
  name: string;
  weight?: number;
  categoryId: number;
  brandId?: number;
  brandName?: string;
  img?: string;
  price?: number;
  productUrl?: string;
  className?: string;
}

export default function AddToPersonalGearButton({
  gearId,
  name,
  weight,
  categoryId,
  brandId,
  brandName,
  img,
  price,
  productUrl,
  className
}: AddToPersonalGearButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleAddToPersonalGear = async () => {
    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/my-gear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          gearId,
          weight,
          categoryId,
          brandId,
          brandName,
          img,
          price,
          productUrl
        }),
      })

      if (response.ok) {
        setIsAdded(true)
      } else {
        throw new Error('Failed to add to personal gear')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      alert('所有ギアの登録に失敗しました')
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
          <p className="text-green-600 mb-2">所有ギアに追加されました！</p>
          <Link href="/my-gear" className="text-blue-500 hover:underline">
            所有ギアを見る
          </Link>
          <p>
            <button
              onClick={() => setIsAdded(false)}
              className="text-blue-500 hover:underline"
            >
              閉じる
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleAddToPersonalGear}
      disabled={isLoading}
      className={`text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 disabled:bg-green-300 transition-colors ${className || ''}`}
    >
      {isLoading ? '追加中...' : '所有ギアに追加'}
    </button>
  )
}
