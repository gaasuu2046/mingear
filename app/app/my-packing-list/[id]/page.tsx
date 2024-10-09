'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PackingList, PackingListItem, Trip } from '@/app/my-packing-list/types';
import { SEASONS } from '@/app/types/season';

interface PageProps {
  params: {
    id: string;
  };
}

export default function MyPackingListDetail({ params }: PageProps) {
  const [packingList, setPackingList] = useState<PackingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPackingList = async () => {
      try {
        const response = await fetch(`/api/packing-list/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch packing list');
        }
        const data = await response.json();
        setPackingList(data);
      } catch (err) {
        setError('パッキングリストの取得に失敗しました');
        console.error('Error fetching packing list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackingList();
  }, [params.id]);


  const calculateTotalWeight = (list: PackingList): number => {
    return list.items.reduce((total, item) => {
      const weight = item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
      return total + weight * item.quantity;
    }, 0);
  };

  const renderGearName = (item: PackingListItem): string => {
    return item.altName ?? item.gear?.name ?? item.personalGear?.name ?? '未設定のギア';
  };

  const renderGearWeight = (item: PackingListItem): number => {
    return item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  if (!packingList) return <div>パッキングリストが見つかりません</div>;


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

          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              作成日:{new Date(packingList.createdAt).toLocaleDateString('ja-JP')} |
              更新日:{new Date(packingList.updatedAt).toLocaleDateString('ja-JP')}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              いいね数: {packingList.likes.length}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{packingList.detail}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-semibold text-gray-700">シーズン:</p>
              <p>{SEASONS.find(season => season.en === packingList.season)?.ja || '未設定'}</p>
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
          {packingList.trips && packingList.trips.length > 0 && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-gray-800">関連する旅程</h3>
              {packingList.trips.map((trip: Trip) => (
                <div key={trip.id} className="mb-4 last:mb-0">
                  <p className="font-semibold">{trip.name}</p>
                  {trip.area && <p>エリア: {trip.area}</p>}
                  {trip.elevation && <p>標高: {trip.elevation}m</p>}
                  {trip.startDate && trip.endDate && (
                    <p>期間: {new Date(trip.startDate).toLocaleDateString('ja-JP')} - {new Date(trip.endDate).toLocaleDateString('ja-JP')}</p>
                  )}
                  {trip.detail && <p className="mt-2">{trip.detail}</p>}
                </div>
              ))}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">アイテム一覧</h2>
          {packingList.items.length > 0 ? (
            <ul className="space-y-2">
              {packingList.items.map((item) => (
                <li key={item.id} className="flex items-center">
                  {(item.gear?.img || item.personalGear?.img) && (
                    <img
                      src={(item.gear?.img ?? undefined) || (item.personalGear?.img ?? undefined)}
                      alt={renderGearName(item)}
                      className="w-8 h-8 object-cover mr-3 rounded-sm"
                    />
                  )}
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium">{renderGearName(item)}</span>
                    <span className="text-sm text-gray-600">
                      {renderGearWeight(item) * item.quantity}g
                      ({item.quantity}個)
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>アイテムがありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
