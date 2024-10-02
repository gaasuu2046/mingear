// components/PackingListDetail.tsx
'use client'

import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SEASONS, Season } from '@/app/types/season'

interface PackingList {
  id: number;
  name: string;
  detail: string | null;
  season: Season;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    quantity: number;
    gear: { name: string; weight: number } | null;
    personalGear: { name: string; weight: number } | null;
  }>;
  userId: string;
  likes: { id: number }[];
  isLikedByCurrentUser?: boolean;
  tripId?: number | null;
}

interface PackingListDetailProps {
  packingList: PackingList;
  trips: Array<{ id: number; name: string }>;
  currentUserId: string | undefined;
}

export default function PackingListDetail({
  packingList: initialPackingList,
  trips,
  currentUserId,
}: PackingListDetailProps) {
  const [packingList, setPackingList] = useState(initialPackingList);
  const router = useRouter();

  const handleLike = async () => {
    if (!currentUserId || currentUserId === packingList.userId) return;

    const response = await fetch(`/api/packing-list/${packingList.id}/like`, {
      method: 'POST',
    });

    if (response.ok) {
      setPackingList(prevList => ({
        ...prevList,
        likes: prevList.isLikedByCurrentUser 
          ? prevList.likes.filter(like => like.id !== Number(currentUserId))
          : [...prevList.likes, { id: Number(currentUserId) }],
        isLikedByCurrentUser: !prevList.isLikedByCurrentUser
      }));
    } else {
      console.error('Failed to like the packing list');
    }
  };

  const calculateTotalWeight = (list: PackingList): number => {
    return list.items.reduce((total, item) => {
      const weight = item.gear?.weight || item.personalGear?.weight || 0
      return total + weight * item.quantity
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => router.back()} 
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        戻る
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{packingList.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <button 
                onClick={handleLike} 
                className={`mr-2 ${currentUserId && currentUserId !== packingList.userId ? 'text-red-500 hover:text-red-600' : 'text-gray-400'}`}
                disabled={!currentUserId || currentUserId === packingList.userId}
              >
                {packingList.isLikedByCurrentUser ? (
                  <HeartSolidIcon className="h-6 w-6" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
              <span className="text-sm font-semibold">{packingList.likes.length}</span>
            </div>
            <span className="text-sm text-gray-600">
              作成日: {new Date(packingList.createdAt).toLocaleDateString('ja-JP')} | 
              更新日: {new Date(packingList.updatedAt).toLocaleDateString('ja-JP')}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{packingList.detail}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-700">シーズン:</p>
              <p>{SEASONS.find(season => season.en === packingList.season)?.ja || '未設定'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">旅程:</p>
              <p>{trips.find(trip => trip.id === packingList.tripId)?.name || '不明'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">アイテム数:</p>
              <p>{packingList.items.length}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">総重量:</p>
              <p>{calculateTotalWeight(packingList)}g</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">アイテム一覧</h2>
          <ul className="space-y-2">
            {packingList.items.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{item.gear?.name || item.personalGear?.name}</span>
                <span className="text-gray-600">
                  {item.gear?.weight || item.personalGear?.weight}g × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
