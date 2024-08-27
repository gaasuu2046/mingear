// app/gear/page.tsx
import { StarIcon } from '@heroicons/react/20/solid'
import { Gear, Review } from '@prisma/client';
import Link from 'next/link'
import { notFound } from 'next/navigation'

import SearchForm from '@/components/SearchForm';
import prisma from '@/lib/prisma'

async function getGearList(searchParams: {
  search?: string;
}) {
  const { search } = searchParams;
  const gearList = await prisma.gear.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
          ],
        } : {}
      ],
    },
    include: {
      reviews: true
    }
  });

  if (!gearList) notFound();
  return gearList;
}

type GearWithReviews = Gear & {
  reviews: Review[];
};

export default async function GearList({ searchParams }: { 
  searchParams: { 
    limit?: string;
    search?: string;
    category?: string;
  } 
}) {
  const { limit, search } = searchParams;
  const gears = await getGearList({ search });
  // const limit = searchParams.limit ? parseInt(searchParams.limit, 10) : undefined;

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
    acc[category] = limit ? gears.slice(0, parseInt(limit, 10)) : gears
    return acc
  }, {} as Record<string, typeof gears>)
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl mt-6">
        {limit ? `カテゴリー別おすすめギア` : 'カテゴリー別ギア一覧'}
      </h1>
      <SearchForm />
      {Object.entries(displayedGearsByCategory).map(([category, gears]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold mt-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gears.map((gear) => (
              <div key={gear.id} className="border ronded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold mb-2">{gear.name}</h3>
                <img src={gear.img} alt={gear.name} className="h-48 w-full object-cover object-center mb-2" />
                <p className="text-gray-600 mb-2">{gear.price}円</p>
                <p className="text-gray-600 mb-2">{gear.weight}g</p>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <p className="text-gray-600">{gear.reviews.length > 0 ? (gear.reviews.reduce((sum, review) => sum + review.rating, 0) / gear.reviews.length).toFixed(2) : 0}</p>
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