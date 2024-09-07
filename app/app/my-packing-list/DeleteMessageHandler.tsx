// components/DeleteMessageHandler.tsx
'use client'

import { useState, useEffect } from 'react'

export default function DeleteMessageHandler() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      setMessage(event.detail)
      setTimeout(() => setMessage(''), 2000) // 3秒後にメッセージを消す
    }

    window.addEventListener('deleteSuccess', handleCustomEvent as EventListener)

    return () => {
      window.removeEventListener('deleteSuccess', handleCustomEvent as EventListener)
    }
  }, [])

  if (!message) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
      {message}
    </div>
  )
}
