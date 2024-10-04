// app/my-packing-list/PackingListClientWrapper.tsx
"use client";

import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaCopy, FaEdit, FaLine, FaPlusCircle } from 'react-icons/fa';

import GearAddModal from './GearAddModal'
import PackingListFormModal from './PackingListFormModal'

import { PackingList, Gear, Trip, PackingListItem } from '@/app/my-packing-list/types';
import { SEASONS } from '@/app/types/season'


interface PackingListClientWrapperProps {
  initialPackingLists: PackingList[];
  userId: string;
  trips: Trip[];
}

export default function PackingListClientWrapper({ initialPackingLists, userId, trips }: PackingListClientWrapperProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists)
  const [selectedList, setSelectedList] = useState<PackingList | null>(null)
  const [isGearModalOpen, setIsGearModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  // const [gearsToReview, setGearsToReview] = useState<Gear[]>([])
  const [expandedLists, setExpandedLists] = useState<number[]>([])
  const [showPopup, setShowPopup] = useState(false);


  const handleNewList = () => {
    setSelectedList(null)
    setIsFormModalOpen(true)
  }

  const handleListClick = (list: PackingList) => {
    setSelectedList(list)
    setIsGearModalOpen(true)
  }

  const handleEditList = (list: PackingList) => {
    setSelectedList(list)
    setIsFormModalOpen(true)
  }

  const handleFormSubmit = async (formData: Partial<PackingList>) => {
    try {
      const url = selectedList
        ? `/api/packing-list/${selectedList.id}`
        : '/api/packing-list';
      const method = selectedList ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save packing list');

      const savedList: PackingList = await response.json();

      setPackingLists(prev =>
        selectedList
          ? prev.map(list => list.id === savedList.id ? savedList : list)
          : [savedList, ...prev]
      );

      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving packing list:', error);
    }
  }

  const handleAddGears = async (newGears: Gear[]) => {
    if (!selectedList) return;

    try {
      const response = await fetch(`/api/packing-list/${selectedList.id}/add-gears`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gears: newGears }),
      });

      if (!response.ok) {
        throw new Error('Failed to add gears to packing list');
      }

      const updatedPackingList = await response.json();

      setPackingLists(prevLists =>
        prevLists.map(list =>
          list.id === updatedPackingList.id ? updatedPackingList : list
        )
      );

      setIsGearModalOpen(false);
      // setGearsToReview(newGears.filter(gear => gear.type === 'public'));
      // setShowReviewForm(true);

    } catch (error) {
      console.error('Error adding gears to packing list:', error);
    }
  }
  // 選択されたリストの既存のギアを取得する関数
  const getExistingGears = (list: PackingList): Gear[] => {
    return list.items.map(item => {
      const gear = item.gear || item.personalGear;
      const isCustomGear = !gear; // ギアが存在しない場合はカスタムギアとみなす
      return {
        id: isCustomGear ? 0 : (gear?.id ?? 0), // 自由記述の場合はIDを0に
        name: item.altName ?? gear?.name ?? '',
        weight: item.altWeight ?? gear?.weight ?? 0,
        quantity: item.quantity,
        type: isCustomGear ? undefined : (item.gear ? 'public' : 'personal'),
        categoryId: item.altCategoryId ?? gear?.categoryId ?? 0,
        description: gear?.description ?? '',
        img: gear?.img || '',
        price: gear?.price || 0,
        productUrl: gear?.productUrl || '',
        brandId: gear?.brandId || 0,
        avgRating: gear?.avgRating || 0,
        reviewCount: gear?.reviewCount || 0,
      };
    });
  };
  const calculateTotalWeight = (list: PackingList): number => {
    return list.items.reduce((total, item) => {
      const weight = item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
      return total + weight * item.quantity;
    }, 0);
  };

  const toggleListExpansion = (listId: number) => {
    setExpandedLists(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }

  const renderGearName = (item: PackingListItem): string => {
    return item.altName ?? item.gear?.name ?? item.personalGear?.name ?? '未設定のギア';
  };


  const renderGearWeight = (item: PackingListItem): number => {
    return item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
  };

  // パッキングリストのテキストを生成する関数
  const generatePackingListText = (list: PackingList) => {
    let text = `パッキングリスト: ${list.name}\n`;
    text += `シーズン: ${SEASONS.find(season => season.en === list.season)?.ja || '未設定'}\n`;
    text += `総重量: ${calculateTotalWeight(list)}g\n`;
    text += `旅程: ${trips.find(trip => trip.id === list.tripId)?.name || '未設定'}\n\n`;
    text += "ギア一覧:\n";
    list.items.forEach(item => {
      text += `- ${renderGearName(item)}: ${renderGearWeight(item)}g (${item.quantity}個)\n`;
    });
    return text;
  };

  // コピー機能
  const handleCopyList = async (list: PackingList) => {
    const text = generatePackingListText(list);
    try {
      await navigator.clipboard.writeText(text);
      setShowPopup(true); // ポップアップを表示
      setTimeout(() => setShowPopup(false), 2000); // 2秒後に非表示
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // LINE共有機能
  const handleShareToLine = (list: PackingList) => {
    const text = encodeURIComponent(generatePackingListText(list));
    const lineUrl = `https://line.me/R/msg/text/?${text}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-6 text-center">マイパッキングリスト</h1>
      <div className="mb-8">
        <button
          onClick={handleNewList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          パッキングリストを作成
        </button>
      </div>

      <div className="overflow-x-auto responsive-table">
        <table className="min-w-full bg-white text-xs table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/2 px-1 py-2 text-left">リスト名</th>
              <th className="w-1/12 px-1 py-2 text-left">シーズン</th>
              <th className="w-1/6 px-1 py-2 text-left">関連する旅程</th>
              <th className="w-1/12 px-1 py-2 text-right">アイテム数</th>
              <th className="w-1/12 px-1 py-2 text-right">総重量</th>
              <th className="w-1/12 px-1 py-2 text-center">いいね数</th>
              <th className="w-1/2 px-1 py-2 text-center">アクション</th>
            </tr>
          </thead>
          <tbody>
            {packingLists.map((list) => (
              <React.Fragment key={list.id}>

                <tr key={list.id} className="border-b hover:bg-gray-50">
                  <td className="px-1 py-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleListExpansion(list.id)}
                        className="mr-1 text-gray-500 hover:text-gray-700"
                      >
                        {expandedLists.includes(list.id) ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <div className="truncate">
                        <div className="font-semibold truncate cursor-help">{list.name}</div>
                        <div className="text-gray-500 truncate">{list.detail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-2 truncate">{SEASONS.find(season => season.en === list.season)?.ja || '未設定'}</td>
                  <td className="px-1 py-2 truncate">{trips.find(trip => trip.id === list.tripId)?.name || '未設定'}</td>
                  <td className="px-1 py-2 text-right">{list.items.length}</td>
                  <td className="px-1 py-2 text-right">{calculateTotalWeight(list)}g</td>
                  <td className="px-1 py-2 text-center">{list.likes?.length || 0}</td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleCopyList(list)}
                        className="bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 mr-1 text-sm"
                        title="リストをコピー"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => handleShareToLine(list)}
                        className="bg-green-500 text-white px-2 py-1.5 rounded hover:bg-green-600 mr-1 text-sm"
                        title="LINEで共有"
                      >
                        <FaLine />
                      </button>
                      <button
                        onClick={() => handleListClick(list)}
                        className="bg-green-500 text-white px-2 py-1.5 rounded hover:bg-green-600 mr-1 text-sm"
                        title="ギアの編集"
                      >
                        <FaPlusCircle />
                      </button>
                      <button
                        onClick={() => handleEditList(list)}
                        className="bg-yellow-500 text-white px-2 py-1.5 rounded hover:bg-yellow-600 text-sm"
                        title="パッキングリスト情報編集"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedLists.includes(list.id) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-2">
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">ギア一覧:</h3>
                        <ul className="space-y-2">
                          {list.items.map((item) => (
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
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isGearModalOpen && selectedList && (
        <GearAddModal
          isOpen={isGearModalOpen}
          onClose={() => setIsGearModalOpen(false)}
          onAddGears={handleAddGears}
          userId={userId}
          existingGears={getExistingGears(selectedList)}
        />
      )}

      <PackingListFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        packingList={selectedList}
        trips={trips}
      />
    </div>
  )
}
