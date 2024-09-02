// app/gear/CategoryNav.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function CategoryNav({ categories, selectedCategory }: { categories: string[], selectedCategory: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      params.delete('page'); // Reset page when changing category
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (category: string) => {
    router.push('/gear?' + createQueryString('category', category));
  };

  return (
    <nav className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-3 py-2 rounded-full ${
            selectedCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
