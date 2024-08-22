// components/ReviewForm.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ReviewForm({ gearId }: { gearId: number }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const router = useRouter()

  const submitReview = async () => {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, gearId }),
    })
    if (response.ok) {
      router.refresh()
      setRating(5)
      setComment('')
    }
  }

  return (
    <div>
      <h3>レビューを投稿</h3>
      <select value={rating} onChange={e => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <textarea value={comment} onChange={e => setComment(e.target.value)} />
      <button onClick={submitReview}>投稿</button>
    </div>
  )
}