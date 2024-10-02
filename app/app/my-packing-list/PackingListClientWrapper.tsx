// app/my-packing-list/PackingListClientWrapper.tsx
"use client";

import { useState } from 'react'

import GearAddModal from './GearAddModal'
import PackingListFormModal from './PackingListFormModal'
import { PackingList, Gear, Trip } from './types'

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
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [gearsToReview, setGearsToReview] = useState<Gear[]>([])

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

      setIsModalOpen(false);
      setGearsToReview(newGears.filter(gear => gear.type === 'public'));
      setShowReviewForm(true);
    } catch (error) {
      console.error('Error adding gears to packing list:', error);
    }
  }

  const handleReviewSubmit = async (gearId: number, rating: number, comment: string) => {
    try {
      await fetch(`/api/gear/${gearId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });

      setGearsToReview(prevGears => prevGears.filter(gear => gear.id !== gearId));
      if (gearsToReview.length === 1) {
        setShowReviewForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  }

  // 選択されたリストの既存のギアを取得する関数
  const getExistingGears = (list: PackingList): Gear[] => {
    return list.items.map(item => {
      const gear = item.gear || item.personalGear;
      return {
        id: gear?.id,
        name: gear?.name || '',
        weight: gear?.weight || 0,
        quantity: item.quantity,
        type: item.gear ? 'public' : 'personal',
        categoryId: gear?.categoryId || 0,
      };
    });
  };
  const calculateTotalWeight = (list: PackingList): number => {
    return list.items.reduce((total, item) => {
      const weight = item.gear?.weight || item.personalGear?.weight || 0;
      return total + weight * item.quantity;
    }, 0);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">マイパッキングリスト</h1>
      <div className="mb-8">
        <button 
          onClick={handleNewList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          パッキングリストを作成
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {packingLists.map((list) => (
          <div key={list.id} className="bg-white shadow-md rounded-lg p-6 transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
              <p>いいね: {list.likes?.length || 0}</p>
            </div>
            <p className="mb-3">{list.detail}</p>
            <div className="text-sm">
              <p>シーズン: {SEASONS.find(season => season.en === list.season)?.ja || '未設定'}</p>
              <p suppressHydrationWarning>作成日: {new Date(list.createdAt).toLocaleDateString('ja-JP')}</p>
              <p suppressHydrationWarning>更新日: {new Date(list.updatedAt).toLocaleDateString('ja-JP')}</p>
              <p>アイテム数: {list.items.length}</p>
              <p>総重量: {calculateTotalWeight(list)}g</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">ギア一覧:</h3>
                <ul className="space-y-2">
                  {list.items.map((item) => (
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
                        <span className="text-sm text-gray-600">
                          {(item.gear?.weight || item.personalGear?.weight || 0) * item.quantity}g
                          ({item.quantity}個)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {list.tripId && <p>旅程: {trips.find(trip => trip.id === list.tripId)?.name || '不明'}</p>}
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => handleListClick(list)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                ギアの編集 +
              </button>
              <button 
                onClick={() => handleEditList(list)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                パッキングリスト情報編集
              </button>
            </div>
          </div>
        ))}
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

      {/* ... (レビューフォームの表示部分は変更なし) ... */}
    </div>
  )
}
