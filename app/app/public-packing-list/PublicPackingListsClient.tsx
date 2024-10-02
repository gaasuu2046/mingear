// app/public-packing-lists/PublicPackingListsClient.tsx
'use client'

import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { SEASONS, Season } from '@/app/types/season'
interface PackingList {
  id: number;
  name: string;
  user: { name: string };
  trip?: { name: string };
  items: {
    gear?: {
      name: string;
      brand?: { name: string };
    } | null;
    personalGear?: {
      name: string;
      brand?: { name: string };
    } | null;
  }[];
  season: Season;
  userId: string;
  _count: { likes: number };
  isLikedByCurrentUser: boolean;
}

interface PublicPackingListsClientProps {
  packingLists: PackingList[];
  currentUserId: string | undefined;
}

export default function PublicPackingListsClient({ packingLists: initialPackingLists, currentUserId }: PublicPackingListsClientProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists);
  const [filteredLists, setFilteredLists] = useState(initialPackingLists);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getJapaneseSeason = (englishSeason: Season) => {
    return SEASONS.find(s => s.en === englishSeason)?.ja || englishSeason;
  };

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
      const englishSeason = SEASONS.find(s => s.ja === selectedSeason)?.en;
      result = result.filter(list => list .season === englishSeason);
    }
    if (searchTerm) {
      result = result.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.trip?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.items.some(
          item => item.gear?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.gear?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())) 
      );
    }
    setFilteredLists(result);
  }, [selectedSeason, searchTerm, packingLists]);


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
            {SEASONS.map(season => (
              <option key={season.en} value={season.ja}>{season.ja}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 max-w-md ml-4">
          <input
            type="text"
            placeholder="リスト名、ギア名、ブランド名等で検索..."
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
              <p className="card-text">シーズン: {getJapaneseSeason(list.season)}</p>
              <div className="mt-4">
                <p className="font-semibold">ギア一覧:</p>
                <ul className="space-y-2">
                  {list.items?.map((item) => (
                    <li key={item.id} className="flex items-center">
                      {(item.gear?.img || item.personalGear?.img) && (
                        <img 
                          src={item.gear?.img || item.personalGear?.img} 
                          alt={item.gear?.name || item.personalGear?.name} 
                          className="w-8 h-8 object-cover mr-3 rounded-sm" 
                        />
                      )}
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium">{item.gear?.name || item.personalGear?.name}</span>
                        <span className="text-sm text-gray-600">{item.gear?.weight || item.personalGear?.weight}g</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
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
                <Link href={`/public-packing-list/${list.id}`} className="btn btn-primary">
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
