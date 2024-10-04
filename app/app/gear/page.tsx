import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { cache } from 'react';

import CategoryNav from './CategoryNav';
import GearCategory from './GearCategory';

import SearchForm from '@/components/form/SearchForm';
import prisma from '@/lib/prisma'

const getCategories = cache(async () => {
  return prisma.category.findMany({ select: { name: true } });
});

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

  const [gears, totalCount] = await Promise.all([
    prisma.gear.findMany({
      where,
      select: {
        id: true,
        name: true,
        avgRating: true,
        description: true,
        productUrl: true,
        brandId: true,
        categoryId: true,
        reviewCount: true,
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        img: true,
        price: true,
        weight: true,
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      orderBy: {
        avgRating: 'desc'
      }
    }),
    prisma.gear.count({ where })
  ]);

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
  const [{ gears, totalCount, pageNumber, pageSize, category }, categories] = await Promise.all([
    getGearList(searchParams),
    getCategories()
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-1">
      <h1 className="text-xl">ギアレビュー</h1>
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
