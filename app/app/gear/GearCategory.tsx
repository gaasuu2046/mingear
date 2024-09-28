// app/gear/GearCategory.tsx
'use client'

import { StarIcon } from '@heroicons/react/20/solid'
import { Gear, Category, Brand } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';

import AddToPackingListButton from '@/components/AddToPackingListButton';
import AddToPersonalGearButton from '@/components/AddToPersonalGearButton';

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {gears.map((gear) => (    
            <div key={gear.id} className="border rounded-lg shadow-md">
              <Link href={`/gear/${gear.id}`} className="block">
                <h3 className="text-sm font-semibold mb-2 line-clamp-2 h-10">{gear.name}</h3>
                <div className="relative w-full h-32 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <Image 
                    src={gear.img} 
                    alt={gear.name} 
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    className="transition-transform h-32 sm:h-48 duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-black">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(gear.price ?? 0)}
                </p>
                <p className="text-black ml-1">{gear.weight}g</p>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <p className="text-black">
                    {gear.avgRating?.toFixed(2) ?? '0'}
                  </p>
                </div>
              </Link>
              <div className="p-1 flex flex-col">
                <div className="flex-1 mb-2 sm:mb-0">
                  <AddToPackingListButton gearId={gear.id} type="public" className="w-full text-sm" />
                </div>
                <div className="flex-1">
                  <AddToPersonalGearButton
                    gearId={gear.id}
                    name={gear.name}
                    weight={gear.weight}
                    categoryId={gear.categoryId}
                    brandId={gear.brandId}
                    brandName={gear.brand.name}
                    img={gear.img}
                    price={gear.price ?? undefined}
                    productUrl={gear.productUrl ?? ''}
                    className="w-full text-sm"
                  />
                </div>
              </div>
            </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {pageNumber > 1 && (
          <button onClick={() => handlePageChange(pageNumber - 1)} className="px-4 py-2 bg-blue-500 text-black rounded">
            前のページ
          </button>
        )}
        {pageNumber < totalPages && (
          <button onClick={() => handlePageChange(pageNumber + 1)} className="px-4 py-2 bg-blue-500 text-black rounded">
            次のページ
          </button>
        )}
      </div>
    </div>
  );
}
