// app/gear/GearCategory.tsx
'use client'

import { StarIcon } from '@heroicons/react/20/solid'
import { Gear, Review } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import { useState } from 'react';

type GearWithReviews = Gear & {
  reviews: Review[];
};

export default function GearCategory({ category, gears }: { category: string, gears: GearWithReviews[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedGears = showAll ? gears : gears.slice(0, 4);

  return (
    <div id={category} className="space-y-4">
      <h2 className="text-2xl font-semibold mt-4">{category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {displayedGears.map((gear) => (
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
            <p className="text-gray-100 mb-2">{gear.price}円</p>
            <p className="text-gray-100 mb-2">{gear.weight}g</p>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <p className="text-gray-100">
                {gear.reviews.length > 0
                  ? (gear.reviews.reduce((sum, review) => sum + review.rating, 0) / gear.reviews.length).toFixed(2)
                  : '0'}
              </p>
            </div>
            <Link href={`/gear/${gear.id}`} className="text-blue-500 hover:underline">
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
      {gears.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          {showAll ? '閉じる' : 'もっと見る'}
        </button>
      )}
    </div>
  );
}
