// app/auth/components/DeleteAccountButton.tsx

'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export default function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDeleteAccount = async () => {
    if (confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      setIsDeleting(true)
      try {
        const response = await fetch('/api/auth/delete', {
          method: 'DELETE',
        })

        if (response.ok) {
          await signOut({ callbackUrl: '/' })
        } else {
          throw new Error('Failed to delete account')
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('アカウントの削除に失敗しました。')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDeleteAccount}
      disabled={isDeleting}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
    >
      {isDeleting ? '退会処理中...' : 'アカウント削除'}
    </button>
  )
}
