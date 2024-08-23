// app/gear/page.tsx
import { StarIcon } from '@heroicons/react/20/solid'
import { Gear, Review } from '@prisma/client';
import Link from 'next/link'
import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'

async function getGearList() {
  const gearList = await prisma.gear.findMany({
    include: {
      reviews: true
    }
  })
  if (!gearList) notFound()
  return gearList
}

type GearWithReviews = Gear & {
  reviews: Review[];
};
export default async function GearList({ limit }: { limit?: number }) {
  const gears = await getGearList();

  // ratingでソート
  const sortGearsByRating = (gears: GearWithReviews[]) => {
    return gears.map(gear => ({
      ...gear,
      averageRating: gear.reviews.length > 0 ? gear.reviews.reduce((sum, review) => sum + review.rating, 0) / gear.reviews.length : 0
    })).sort((a, b) => b.averageRating - a.averageRating);
  };
  // ギアをカテゴリーごとにグループ化
  const gearsByCategory = sortGearsByRating(gears).reduce((acc, gear) => {
    if (!acc[gear.category]) {
      acc[gear.category] = []
    }
    acc[gear.category].push(gear)
    return acc;
  } , {} as Record<string, typeof gears>)
  
  // カテゴリーごとに表示するギアを制限（もしlimitが指定されている場合）
  const displayedGearsByCategory  = Object.entries(gearsByCategory).reduce((acc, [category, gears]) => {
    acc[category] = limit ? gears.slice(0, limit) : gears
    return acc
  }, {} as Record<string, typeof gears>)
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mt-6">
        {limit ? `カテゴリー別おすすめギア` : 'カテゴリー別ギア一覧'}
      </h1>
      {Object.entries(displayedGearsByCategory).map(([category, gears]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold mt-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gears.map((gear) => (
              <div key={gear.id} className="border rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold mb-2">{gear.name}</h3>
                <img src={gear.img} alt={gear.name} className="h-48 w-full object-cover object-center mb-2" />
                <p className="text-gray-600 mb-2">{gear.price}円</p>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <p className="text-gray-600">{gear.reviews.length > 0 ? gear.reviews.reduce((sum, review) => sum + review.rating, 0) / gear.reviews.length : 0}</p>
                </div>
                <Link href={`/gear/${gear.id}`} className="text-blue-500 hover:underline">
                  詳細を見る
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}