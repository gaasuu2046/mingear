'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  // const [category, setCategory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    // if (category) params.append('category', category);
    router.push(`/gear?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="検索キーワード"
        className="border p-2 rounded text-black"
      />
      {/* <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="カテゴリー"
        className="border p-2 rounded"
      /> */}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        検索
      </button>
    </form>
  );
}
