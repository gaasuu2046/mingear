// app/my-packing-list/DeleteButton.tsx

'use client'

import { useState } from 'react'

interface DeleteButtonProps {
  id: number
  className?: string
}

export default function DeleteButton({ id,className }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/packing-list', {
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
      // カスタムイベントを発火
      const event = new CustomEvent('deleteSuccess', { detail: 'アイテムが正常に削除されました' })
      window.dispatchEvent(event)

      // ページをリロード
      window.location.reload()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('アイテムの削除に失敗しました。')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      className={`bg-red-500 text-black rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300 w-full ${className}`}
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? '削除中...' : '削除'}
    </button>
  )
}
