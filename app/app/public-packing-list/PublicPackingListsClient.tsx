'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Item, PackingList } from '@/app/public-packing-list/types';
import { SEASONS } from '@/app/types/season';
import LikeButton from '@/components/button/LikeButton';

interface PublicPackingListsClientProps {
  packingLists: PackingList[];
  currentUserId: string | undefined;
}

export default function PublicPackingListsClient({ packingLists: initialPackingLists, currentUserId }: PublicPackingListsClientProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists);
  const [filteredLists, setFilteredLists] = useState(initialPackingLists);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState<{ [key: number]: string }>({});

  const getJapaneseSeason = (englishSeason: string) => {
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
      result = result.filter(list => list.season === englishSeason);
    }

    if (selectedArea) {
      result = result.filter(list =>
        list.trips.some(trip => trip.area?.toLowerCase() === selectedArea.toLowerCase())
      );
    }

    if (searchTerm) {
      result = result.filter(list =>
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.trips.some(trip =>
          trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.area?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        list.items.some(
          item => item.gear?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.gear?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredLists(result);
  }, [selectedSeason, selectedArea, searchTerm, packingLists]);

  const renderGearName = (item: Item): string => {
    return item.altName ?? item.gear?.name ?? item.personalGear?.name ?? '未設定のギア';
  };

  const renderGearWeight = (item: Item): number => {
    return item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
  };

  const calculateTotalWeight = (list: PackingList): number => {
    return list.items.reduce((total, item) => {
      return total + renderGearWeight(item) * item.quantity;
    }, 0);
  };

  const generatePackingListText = (list: PackingList) => {
    let text = `パッキングリスト: ${list.name}\n`;
    text += `作成者: ${list.user.name}\n`;
    text += `シーズン: ${getJapaneseSeason(list.season)}\n`;
    text += `総重量: ${calculateTotalWeight(list)}g\n`;
    text += `旅程: ${list.trips.map(trip => `${trip.name} (${trip.area || '場所未設定'})`).join(', ') || '未設定'}\n\n`;
    text += "ギア一覧:\n";
    list.items.forEach(item => {
      text += `- ${renderGearName(item)}: ${renderGearWeight(item)}g (${item.quantity}個)\n`;
    });
    return text;
  };

  const handleCopyList = async (list: PackingList) => {
    const text = generatePackingListText(list);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [list.id]: 'コピーしました！' });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [list.id]: '' });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus({ ...copyStatus, [list.id]: 'コピーに失敗しました' });
    }
  };

  // すべてのエリアを取得
  const allAreas = Array.from(new Set(packingLists.flatMap(list => list.trips.map(trip => trip.area)).filter((area): area is string => area !== null)));

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

        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <label htmlFor="area-filter" className="font-semibold">エリア:</label>
          <select
            id="area-filter"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="">全て</option>
            {allAreas.map(area => (
              <option key={area} value={area}>{area}</option>
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
          <div key={list.id} className="card bg-white shadow-md rounded-lg overflow-hidden">
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold mb-4">{list.name}</h2>
              <div className="flex items-center justify-between mt-4">
                <p className="card-text mb-2">作成者: {list.user.name}</p>
                {currentUserId && (
                  <LikeButton
                    isLiked={list.isLikedByCurrentUser ?? false}
                    onLike={() => handleLike(list.id)}
                    likeCount={list._count.likes}
                  />
                )}
                {!currentUserId && (
                  <span className="text-sm font-semibold mt-5">{list._count.likes}人がいいね!</span>
                )}
              </div>
              <div className="overflow-x-auto responsive-table">
                <table className="min-w-full text-left bg-white">
                  <tbody>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">詳細</th>
                      <td className="border">{list.detail}</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">シーズン</th>
                      <td className="border">{SEASONS.find(season => season.en === list.season)?.ja || '未設定'}</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">作成日</th>
                      <td suppressHydrationWarning className="border p-2">{new Date(list.createdAt).toLocaleDateString('ja-JP')}</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">更新日</th>
                      <td suppressHydrationWarning className="border p-2">{new Date(list.updatedAt).toLocaleDateString('ja-JP')}</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">アイテム数</th>
                      <td className="border">{list.items.length}</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">総重量</th>
                      <td className="border">{calculateTotalWeight(list)}g</td>
                    </tr>
                    <tr>
                      <th className="w-24 sm:w-32 border bg-gray-100 text-left px-2 py-1">旅程</th>
                      <td className="border">
                        {list.trips.map(trip => (
                          <div key={trip.id}>
                            {trip.name} ({trip.area || '場所未設定'})
                          </div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto responsive-table text-xs">
                <p className="font-semibold mb-2">ギア一覧:</p>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-100 text-left">ギア名</th>
                      <th className="border p-2 bg-gray-100 text-left">重量</th>
                      <th className="border p-2 bg-gray-100 text-left">数量</th>
                      <th className="border p-2 bg-gray-100 text-left">合計重量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="border p-2">
                          {(item.gear?.img || item.personalGear?.img) && (
                            <img
                              src={(item.gear?.img ?? undefined) || (item.personalGear?.img ?? undefined)}
                              alt={renderGearName(item)}
                              className="w-8 h-8 object-cover mr-2 inline-block"
                            />
                          )}
                          {renderGearName(item)}
                        </td>
                        <td className="border p-2">{renderGearWeight(item)}g</td>
                        <td className="border p-2">{item.quantity}個</td>
                        <td className="border p-2">{renderGearWeight(item) * item.quantity}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleCopyList(list)}
                  className="btn btn-secondary"
                >
                  {copyStatus[list.id] || 'リストをコピー'}
                </button>
                <Link href={`/public-packing-list/${list.id}`} className="btn btn-primary">
                  詳細を見る
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
