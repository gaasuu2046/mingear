// app/my-packing-list/PackingListClientWrapper.tsx
"use client";

import Link from 'next/link';
import React, { useState, useCallback, useMemo } from 'react'
import { FaChevronDown, FaChevronUp, FaCopy, FaEdit, FaLine, FaPlusCircle, FaTrash } from 'react-icons/fa';

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
  const [expandedLists, setExpandedLists] = useState<number[]>([])
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteList = useCallback(async (listId: number) => {
    if (!confirm('このパッキングリストを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/packing-list/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete packing list');

      setPackingLists(prev => prev.filter(list => list.id !== listId));
    } catch (error) {
      console.error('Error deleting packing list:', error);
    }
  }, []);

  const handleNewList = useCallback(() => {
    setSelectedList(null)
    setIsFormModalOpen(true)
  }, [])

  const handleListClick = useCallback((list: PackingList) => {
    setSelectedList(list)
    setIsGearModalOpen(true)
  }, [])

  const handleEditList = useCallback((list: PackingList) => {
    setSelectedList(list)
    setIsFormModalOpen(true)
  }, [])

  const handleFormSubmit = useCallback(async (formData: Partial<PackingList>) => {
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
  }, [selectedList])

  const handleAddGears = useCallback(async (newGears: Gear[]) => {
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
    } catch (error) {
      console.error('Error adding gears to packing list:', error);
    }
  }, [selectedList])

  const getExistingGears = useCallback((list: PackingList): Gear[] => {
    return list.items.map(item => {
      const gear = item.gear || item.personalGear;
      const isCustomGear = !gear;
      return {
        id: isCustomGear ? 0 : (gear?.id ?? 0),
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
  }, [])

  const calculateTotalWeight = useCallback((list: PackingList): number => {
    return list.items.reduce((total, item) => {
      const weight = item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
      return total + weight * item.quantity;
    }, 0);
  }, [])

  const toggleListExpansion = useCallback((listId: number) => {
    setExpandedLists(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }, [])

  const renderGearName = useCallback((item: PackingListItem): string => {
    return item.altName ?? item.gear?.name ?? item.personalGear?.name ?? '未設定のギア';
  }, [])

  const renderGearWeight = useCallback((item: PackingListItem): number => {
    return item.altWeight ?? item.gear?.weight ?? item.personalGear?.weight ?? 0;
  }, [])

  const renderRelatedTrips = useCallback((list: PackingList) => {
    if (!list.trips || list.trips.length === 0) return '未設定';
    return list.trips.map(trip => trip.name).join(', ');
  }, [])

  const generatePackingListText = useCallback((list: PackingList) => {
    let text = `パッキングリスト: ${list.name}\n`;
    text += `シーズン: ${SEASONS.find(season => season.en === list.season)?.ja || '未設定'}\n`;
    text += `総重量: ${calculateTotalWeight(list)}g\n`;
    text += `旅程: ${renderRelatedTrips(list)}\n\n`;
    text += "ギア一覧:\n";
    list.items.forEach(item => {
      text += `- ${renderGearName(item)}: ${renderGearWeight(item)}g (${item.quantity}個)\n`;
    });
    return text;
  }, [calculateTotalWeight, renderGearName, renderGearWeight, renderRelatedTrips])

  const handleCopyList = useCallback(async (list: PackingList) => {
    const text = generatePackingListText(list);
    try {
      await navigator.clipboard.writeText(text);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [generatePackingListText])

  const handleShareToLine = useCallback((list: PackingList) => {
    const text = encodeURIComponent(generatePackingListText(list));
    const lineUrl = `https://line.me/R/msg/text/?${text}`;
    window.open(lineUrl, '_blank');
  }, [generatePackingListText])


  const memoizedPackingLists = useMemo(() => packingLists, [packingLists]);

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
              <th className="w-1/4 px-1 py-2 text-left">リスト名</th>
              <th className="w-1/12 px-1 py-2 text-left">シーズン</th>
              <th className="w-1/4 px-1 py-2 text-left">関連する旅程</th>
              <th className="w-1/12 px-1 py-2 text-right">アイテム数</th>
              <th className="w-1/12 px-1 py-2 text-right">総重量</th>
              <th className="w-1/12 px-1 py-2 text-center">いいね数</th>
              <th className="w-1/12 px-1 py-2 text-center">ギア追加</th>
              <th className="w-1/6 px-1 py-2 text-center">編集<br />(シーズン・旅程)</th>
              <th className="w-1/6 px-1 py-2 text-center">共有</th>
              <th className="w-1/12 px-1 py-2 text-center">削除</th>
            </tr>
          </thead>
          <tbody>
            {memoizedPackingLists.map((list) => (
              <React.Fragment key={list.id}>
                <tr className="border-b hover:bg-gray-50">
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
                  <td className="px-1 py-2 truncate">
                    {renderRelatedTrips(list)}
                  </td>
                  <td className="px-1 py-2 text-right">{list.items.length}</td>
                  <td className="px-1 py-2 text-right">{calculateTotalWeight(list)}g</td>
                  <td className="px-1 py-2 text-center">{list.likes?.length || 0}</td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleListClick(list)}
                      className="bg-green-500 text-white px-2 py-1.5 rounded hover:bg-green-600 mr-1 text-sm"
                      title="ギアの編集"
                    >
                      <FaPlusCircle />
                    </button>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleEditList(list)}
                      className="bg-yellow-500 text-white px-2 py-1.5 rounded hover:bg-yellow-600 text-sm"
                      title="パッキングリスト情報編集"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleCopyList(list)}
                        className="bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 mr-1 text-sm"
                        title="リストをコピー"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => handleShareToLine(list)}
                        className="bg-green-500 text-white px-2 py-1.5 rounded hover:bg-green-600 text-sm"
                        title="LINEで共有"
                      >
                        <FaLine />
                      </button>

                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 text-sm"
                      title="パッキングリストを削除"
                    >
                      <FaTrash />
                    </button>
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
                              {item.gear ? (
                                <div className="flex items-center">
                                  <Link href={`/gear/${item.gear.id}`} className="flex items-center hover:underline">
                                    {item.gear?.img && (
                                      <img
                                        src={item.gear.img}
                                        alt={renderGearName(item)}
                                        className="w-8 h-8 object-cover mr-3 rounded-sm"
                                      />
                                    )}
                                    <span className="font-medium">{renderGearName(item)}</span>
                                    <span className="ml-2 font-medium">
                                      {renderGearWeight(item) * item.quantity}g
                                      ({item.quantity}個)
                                    </span>
                                  </Link>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  {item.personalGear?.img && (
                                    <img
                                      src={item.personalGear.img}
                                      alt={renderGearName(item)}
                                      className="w-8 h-8 object-cover mr-3 rounded-sm"
                                    />
                                  )}
                                  <span className="font-medium">{renderGearName(item)}</span>
                                  <span className="ml-auto text-sm text-gray-600">
                                    {renderGearWeight(item) * item.quantity}g
                                    ({item.quantity}個)
                                  </span>
                                </div>
                              )}
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

      {
        isGearModalOpen && selectedList && (
          <GearAddModal
            isOpen={isGearModalOpen}
            onClose={() => setIsGearModalOpen(false)}
            onAddGears={handleAddGears}
            userId={userId}
            existingGears={getExistingGears(selectedList)}
          />
        )
      }

      <PackingListFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        packingList={selectedList}
        trips={trips}
      />

      {
        showPopup && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            リストをコピーしました！
          </div>
        )
      }
    </div >
  )
}
