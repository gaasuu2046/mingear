// app/my-packing-list/DeleteButton.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  gearId: number
}

export default function DeleteButton({ gearId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/packing-list', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gearId }),
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
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? '削除中...' : 'リストから削除'}
    </button>
  )
}
