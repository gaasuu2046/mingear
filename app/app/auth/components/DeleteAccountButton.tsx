// components/DeleteAccountButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleDeleteRequest = () => {
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/auth/signin')
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('アカウントの削除に失敗しました。')
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
  }

  return (
    <>
      <button
        onClick={handleDeleteRequest}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
        disabled={isDeleting}
      >
        {isDeleting ? '削除中...' : 'アカウントを削除'}
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-500">警告: アカウント削除</h2>
            <p className="mb-6">本当にアカウントを削除しますか？この操作は取り消せません。</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
