// app/public-packing-lists/PublicPackingListsClient.tsx
'use client'

import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface PackingList {
  id: number;
  name: string;
  user: { name: string };
  trip?: { name: string };
  items: any[];
  season: string;
  userId: string;
  _count: { likes: number };
  isLikedByCurrentUser: boolean;
}

interface PublicPackingListsClientProps {
  packingLists: PackingList[];
  currentUserId: string | undefined;
}

const seasons = [
  { ja: '春', en: 'SPRING' },
  { ja: '夏', en: 'SUMMER' },
  { ja: '秋', en: 'AUTUMN' },
  { ja: '冬', en: 'WINTER' },
];

export default function PublicPackingListsClient({ packingLists: initialPackingLists, currentUserId }: PublicPackingListsClientProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists);
  const [filteredLists, setFilteredLists] = useState(initialPackingLists);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = async (listId: number) => {
    const response = await fetch(`/api/packing-list/${listId}/like`, {
      method: 'POST',
    });

    if (response.ok) {
      setPackingLists(packingLists.map(list => 
        list.id === listId 
          ? {
              ...list, 
              _count: {
                ...list._count, 
                likes: list.isLikedByCurrentUser ? list._count.likes - 1 : list._count.likes + 1
              },
              isLikedByCurrentUser: !list.isLikedByCurrentUser
            }
          : list
      ));
    }
  };

  useEffect(() => {
    let result = packingLists;
    if (selectedSeason) {
      const englishSeason = seasons.find(s => s.ja === selectedSeason)?.en;
      result = result.filter(list => list.season === englishSeason);
    }
    if (searchTerm) {
      result = result.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.trip?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLists(result);
  }, [selectedSeason, searchTerm, packingLists]);

  const getJapaneseSeason = (englishSeason: string) => {
    return seasons.find(s => s.en === englishSeason)?.ja || englishSeason;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">人気のパッキングリスト</h1>
      
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <label htmlFor="season-filter" className="font-semibold">シーズン:</label>
          <select
            id="season-filter"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">全て</option>
            {seasons.map(season => (
              <option key={season.en} value={season.ja}>{season.ja}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 max-w-md ml-4">
          <input
            type="text"
            placeholder="リスト名、作成者、山行名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLists.map((list) => (
          <div key={list.id} className="card">
            <div className="card-body">
              <h2 className="card-title">{list.name}</h2>
              <p className="card-text">作成者: {list.user.name}</p>
              <p className="card-text">山行: {list.trip?.name || '未設定'}</p>
              <p className="card-text">アイテム数: {list.items.length}</p>
              <p className="card-text">シーズン: {getJapaneseSeason(list.season)}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  {currentUserId && currentUserId !== list.userId && (
                    <button 
                      onClick={() => handleLike(list.id)} 
                      className="mr-2 text-red-500 hover:text-red-600"
                    >
                      {list.isLikedByCurrentUser ? (
                        <HeartSolidIcon className="h-6 w-6" />
                      ) : (
                        <HeartIcon className="h-6 w-6" />
                      )}
                    </button>
                  )}
                  <span className="text-sm font-semibold">{list._count.likes}</span>
                </div>
                <Link href={`/packing-list/${list.id}`} className="btn btn-primary">
                  詳細を見る
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
