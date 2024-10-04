// app/public-packing-lists/[id]/components/PackingListDetail.tsx
'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PackingList, Trip } from '@/app/public-packing-list/types';
import { SEASONS } from '@/app/types/season';
import LikeButton from '@/components/button/LikeButton';
import PackingListItem from '@/components/list/PackingListItem';

interface PackingListDetailProps {
  packingList: PackingList; // 共通の型を使用
  trips: Trip[]; // Trip 型も共通化
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
          : [...prevList.likes, { id: Number(currentUserId), userId: currentUserId }],
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
    }, 0);
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
            <LikeButton
              isLiked={packingList.isLikedByCurrentUser ?? false}
              onLike={handleLike}
              likeCount={packingList.likes.length}
              disabled={!currentUserId || currentUserId === packingList.userId}
            />
            <span suppressHydrationWarning className="text-sm text-gray-600">
              作成日:{new Date(packingList.createdAt).toLocaleDateString('ja-JP')} |
              更新日:{new Date(packingList.updatedAt).toLocaleDateString('ja-JP')}
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
              <PackingListItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
