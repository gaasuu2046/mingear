// app/my-packing-list/PackingListClientWrapper.tsx
'use client'


import { useState } from 'react'

import GearAddModal from '@/app/my-packing-list/GearAddModal'
import PackingListClient from '@/app/my-packing-list/PackingListClient'

export default function PackingListClientWrapper({ initialPackingLists, userId }) {
  const [packingLists, setPackingLists] = useState(initialPackingLists)
  const [selectedList, setSelectedList] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleNewList = async (newList) => {
    setPackingLists([newList, ...packingLists])
  }

  const handleListClick = (list) => {
    setSelectedList(list)
    setIsModalOpen(true)
  }

  const handleAddGear = async (newGear) => {
    if (!selectedList) return;

    try {

      const response = await fetch(`/api/packing-list/${selectedList.id}/add-gear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gearId: newGear.type === 'public' ? newGear.id : undefined,
          personalGearId: newGear.type === 'personal' ? newGear.id : undefined,
          name: newGear.name,  // 新しいギアの場合に使用
          quantity: 1, // デフォルト値として1を設定
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add gear to packing list');
      }

      const updatedPackingList = await response.json();

      // 状態を更新
      setPackingLists(prevLists =>
        prevLists.map(list =>
          list.id === updatedPackingList.id ? updatedPackingList : list
        )
      );

      // モーダルを閉じる
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding gear to packing list:', error);
      // エラーハンドリング（例：ユーザーへの通知）
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">マイパッキングリスト</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">新規リスト作成</h2>
        <PackingListClient initialPackingLists={packingLists} onNewList={handleNewList} userId={userId} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {packingLists.map((list) => (
          <div key={list.id} className="bg-white shadow-md rounded-lg p-6 transition duration-300 hover:shadow-lg cursor-pointer" onClick={() => handleListClick(list)}>
            <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
            <p className="mb-3">{list.detail}</p>
            <div className="text-sm">
              <p>シーズン: {list.season}</p>
              <p suppressHydrationWarning>作成日: {new Date(list.createdAt).toLocaleDateString('ja-JP')}</p>
              <p suppressHydrationWarning>更新日: {new Date(list.updatedAt).toLocaleDateString('ja-JP')}</p>
              <p>アイテム数: {list.items?.length || 0}</p>
              <p>いいね数: {list.likes?.length || 0}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">ギア一覧:</h3>
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
          </div>
        ))}
      </div>

      {isModalOpen && (
        <GearAddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddGear={handleAddGear}
          userId={userId}
        />
      )}
    </div>
  )
}
