// app/my-packing-list/DeleteButton.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  id: number
  className?: string
}

export default function DeleteButton({ id, className }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/my-gear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      const result = await response.json()
      console.log(`Deleted ${result.deletedCount} item(s)`)

      // 削除成功後、ページを更新
      router.refresh()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('アイテムの削除に失敗しました。')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
    className={`text-xs bg-red-500 text-white py-1 px-2 rounded hover:bg-red-800 disabled:bg-green-300 transition-colors ${className || ''}`}
    onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  )
}
