// components/DeleteMessageHandler.tsx
'use client'

import { useState, useEffect } from 'react'

export default function DeleteMessageHandler() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      setMessage(event.detail)
      setTimeout(() => setMessage(''), 3000) // 3秒後にメッセージを消す
    }

    window.addEventListener('deleteSuccess', handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener('deleteSuccess', handleCustomEvent as EventListener)
    }
  }, [])

  if (!message) return null

  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg">
      {message}
    </div>
  )
}
