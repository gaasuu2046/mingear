// app/gear/GearCategory.tsx
'use client'

import { StarIcon } from '@heroicons/react/20/solid'
import { Gear, Category, Brand } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';

type GearWithReviewsAndRelations = Gear & {
  category: Category;
  brand: Brand;
};

export default function GearCategory({ 
  category, 
  gears, 
  pageNumber, 
  totalPages 
}: { 
  category: string, 
  gears: GearWithReviewsAndRelations[], 
  pageNumber: number,
  totalPages: number
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/gear?${params.toString()}`);
  };

  return (
    <div id={category} className="space-y-4">
      <h2 className="text-2xl font-semibold mt-4">{category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {gears.map((gear) => (
          <div key={gear.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{gear.name}</h3>
            <div className="relative w-full h-48 mb-2">
            <Image 
                src={gear.img} 
                alt={gear.name} 
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <p className="text-gray-700 mb-2">{gear.price}円</p>
            <p className="text-gray-700 mb-2">{gear.weight}g</p>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <p className="text-gray-700">
                {gear.avgRating?.toFixed(2) ?? '0'}
              </p>
            </div>
            <Link href={`/gear/${gear.id}`} className="text-blue-500 hover:underline">
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {pageNumber > 1 && (
          <button onClick={() => handlePageChange(pageNumber - 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
            前のページ
          </button>
        )}
        {pageNumber < totalPages && (
          <button onClick={() => handlePageChange(pageNumber + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
            次のページ
          </button>
        )}
      </div>
    </div>
  );
}
