// app/gear/page.tsx
import { Gear, Review } from '@prisma/client';
import { notFound } from 'next/navigation'

import CategoryNav from './CategoryNav'; // 新しいコンポーネント
import GearCategory from './GearCategory'; // 新しいコンポーネント

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
    search?: string;
    category?: string;
  } 
}) {
  const { search } = searchParams;
  const gears = await getGearList({ search });

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
  
  const categories = Object.keys(gearsByCategory);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl mt-6">カテゴリー別ギア一覧</h1>
      <SearchForm />
      <CategoryNav categories={categories} />
      {categories.map((category) => (
        <GearCategory 
          key={category} 
          category={category} 
          gears={gearsByCategory[category]} 
        />
      ))}
    </div>
  )
}
