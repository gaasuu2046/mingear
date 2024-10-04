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
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-black">レビューを投稿</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1 text-black">
            評価
          </label>
          <select
            id="rating"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            コメント
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md text-black"
            placeholder="あなたの感想を書いてください..."
          />
        </div>
        <button
          onClick={submitReview}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          投稿
        </button>
      </div>
    </div>
  )
}