// app/reviews/page.tsx
import Link from 'next/link'

import prisma from '@/lib/prisma'

async function getReviewList() {
  const reviews = await prisma.review.findMany()
  // reviewsにgearNameを追加
  return Promise.all(reviews.map(async (review: { id: number; rating: number; comment: string; gearId: number; createdAt: Date; gearName?: string }) => {
    review.gearName = await prisma.gear.findUnique({
      where: { id: review.gearId }
    }).then((gear) => gear?.name)
    return review
  }))
}

const reviews = await getReviewList();

export default function ReviewList() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">最新のレビュー</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                <Link href={`/gear/${review.gearId}`} className="text-blue-500 hover:underline">
                  {review.gearName}
                </Link>
              </h2>
              <p className="text-sm text-gray-500">{review.createdAt.toLocaleString()}</p>
            </div>
            <p className="text-yellow-500 mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            {/* <p className="text-sm text-gray-500">レビュアー: {review.author}</p> */}
          </div>
        ))}
      </div>
    </div>
  )
}