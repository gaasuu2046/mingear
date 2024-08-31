// app/gear/CategoryNav.tsx
'use client'

import { useState } from 'react';

export default function CategoryNav({ categories }: { categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <nav className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <a
          key={category}
          href={`#${category}`}
          className={`px-3 py-2 rounded-full ${
            activeCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </a>
      ))}
    </nav>
  );
}
