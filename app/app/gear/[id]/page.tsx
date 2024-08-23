// app/gear/[id]/page.tsx
import { StarIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ReviewForm from '@/components/ReviewForm'
import prisma from '@/lib/prisma'

async function getGear(id: string) {
  const gear = await prisma.gear.findUnique({
    where: { id: parseInt(id) },
    include: { reviews: true },
  })
  if (!gear) notFound()
  return gear
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default async function GearDetail({ params }: { params: { id: string } }) {
  const gear = await getGear(params.id)
  const averageRating = gear.reviews.length > 0
    ? (gear.reviews.reduce((acc, review) => acc + review.rating, 0) / gear.reviews.length).toFixed(2)
    : 0

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* 商品画像 */}
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
            <Image 
              src={gear.img} 
              alt={gear.name} 
              width={640} 
              height={640} 
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* 商品情報 */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{gear.name}</h1>
            <div className="mt-3">
              <h2 className="sr-only">商品情報</h2>
              <p className="text-lg text-gray-900">ブランド: {gear.brand}</p>
              <p className="text-gray-600 mb-2">{gear.price}円</p>
            </div>
            <div className="mt-6">
              <h3 className="sr-only">説明</h3>
              <p className="text-base text-gray-500">{gear.description}</p>
            </div>
            <div className="mt-6">
            <Link href={gear.productUrl || '#'} className="text-blue-500 hover:underline">
              購入
            </Link>
            </div>
            <div className="mt-6 flex items-center">
              <StarIcon className="text-yellow-400 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p className="ml-2 text-sm text-gray-500">
                {averageRating} out of 5 stars ({gear.reviews.length} reviews)
              </p>
            </div>
          </div>
        </div>

        {/* レビューセクション */}
        <section aria-labelledby="reviews-heading" className="mt-16 lg:mt-24">
          <h2 id="reviews-heading" className="text-2xl font-bold tracking-tight text-gray-900">レビュー</h2>

          <div className="mt-8 divide-y divide-gray-200">
            {gear.reviews.map((review) => (
              <div key={review.id} className="py-8">
                <div className="flex items-center">
                  <div>
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-500">{review.rating} out of 5 stars</p>
                </div>
                <p className="mt-4 text-base text-gray-900">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* レビューフォーム */}
          <div className="mt-16">
            <h3 className="text-lg font-medium text-gray-900">レビューを投稿</h3>
            <ReviewForm gearId={gear.id} />
          </div>
        </section>
      </div>
    </div>
  )
}