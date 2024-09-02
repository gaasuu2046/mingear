import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import CategoryNav from './CategoryNav';
import GearCategory from './GearCategory';

import SearchForm from '@/components/SearchForm';
import prisma from '@/lib/prisma'

async function getGearList(searchParams: {
  search?: string;
  category?: string;
  page?: string;
}) {
  const { search, category = 'テント・タープ', page } = searchParams;
  const pageNumber = parseInt(page || '1', 10);
  const pageSize = 20;

  const where: Prisma.GearWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { brand: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {},
      { category: { name: category } },
    ],
  };
  
  const gears = await prisma.gear.findMany({
    where,
    include: {
      category: true,
      brand: true
    },
    take: pageSize,
    skip: (pageNumber - 1) * pageSize,
    orderBy: {
      avgRating: 'desc'
    }
  });

  const totalCount = await prisma.gear.count({ where });

  if (!gears.length && pageNumber > 1) notFound();

  return { gears, totalCount, pageNumber, pageSize, category };
}

export default async function GearList({ searchParams }: { 
  searchParams: { 
    search?: string;
    category?: string;
    page?: string;
  } 
}) {
  const { gears, totalCount, pageNumber, pageSize, category } = await getGearList(searchParams);
  const totalPages = Math.ceil(totalCount / pageSize);

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl mt-6">ギア一覧</h1>
      <SearchForm />
      <CategoryNav categories={categories.map(c => c.name)} selectedCategory={category} />
      <Suspense fallback={<div>Loading...</div>}>
        <GearCategory 
          category={category}
          gears={gears}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  )
}
