// app/reviews/page.tsx
import Link from 'next/link'

const reviews = [
  { id: 1, gearName: 'テント', gearId: 1, rating: 5, comment: '非常に軽量で設営も簡単。雨風にも強く、安心して使えます。', author: '山田太郎', date: '2024-08-15' },
  { id: 2, gearName: '寝袋', gearId: 2, rating: 4, comment: '保温性が高く、快適に眠れました。ただ、少し重いかも。', author: '鈴木花子', date: '2024-08-14' },
  { id: 3, gearName: 'バックパック', gearId: 3, rating: 5, comment: '背負い心地が最高！長時間の山歩きでも疲れにくいです。', author: '佐藤次郎', date: '2024-08-13' },
  { id: 4, gearName: 'トレッキングポール', gearId: 4, rating: 4, comment: 'しっかりした作りで信頼できます。握りの形状が少し合わないかも。', author: '高橋美咲', date: '2024-08-12' },
  { id: 5, gearName: 'UL靴', gearId: 5, rating: 5, comment: 'フィット感抜群！長距離歩いても足が痛くならない。', author: '田中健太', date: '2024-08-11' },
]

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
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
            <p className="text-yellow-500 mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            <p className="text-sm text-gray-500">レビュアー: {review.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}