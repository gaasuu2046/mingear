'use client'

import { Gear, PersonalGear, Category, Trip, PackingList, PackingListItem } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import DeleteMessageHandler from './DeleteMessageHandler'

import RefreshOnRedirect from '@/components/RefreshOnRedirect'
import { SearchSuggestionComponent } from '@/components/SearchSuggestionComponent'

interface GearWithCategory extends Gear {
  category: Category;
}

interface PersonalGearWithCategory extends PersonalGear {
  category: Category;
}

interface PackingListItemWithGear extends PackingListItem {
  gear: GearWithCategory | null;
  personalGear: PersonalGearWithCategory | null;
}

interface PackingListWithItems extends PackingList {
  items: PackingListItemWithGear[];
  trip: Trip | null;
}

interface PackingListClientProps {
  initialPackingLists: PackingListWithItems[];
}

export default function PackingListClient({ initialPackingLists }: PackingListClientProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists);
  const [copySuccess, setCopySuccess] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
        {message}
      </div>
    );
  };

  const handleAddGear = async (listId: number, gear: Gear | PersonalGear) => {
    const isPersonalGear = 'userId' in gear;
    const response = await fetch(`/api/packing-lists/${listId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gearId: isPersonalGear ? null : gear.id,
        personalGearId: isPersonalGear ? gear.id : null,
      }),
    });

    if (response.ok) {
      const newItem = await response.json();
      setPackingLists(prevLists => 
        prevLists.map(list => 
          list.id === listId 
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
      setToastMessage('アイテムを追加しました！');
    } else {
      setToastMessage('アイテムの追加に失敗しました');
    }
  };

  const handleRemoveGear = async (listId: number, itemId: number) => {
    const response = await fetch(`/api/packing-lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setPackingLists(prevLists => 
        prevLists.map(list => 
          list.id === listId 
            ? { ...list, items: list.items.filter(item => item.id !== itemId) }
            : list
        )
      );
      setToastMessage('アイテムを削除しました');
    } else {
      setToastMessage('アイテムの削除に失敗しました');
    }
  };

  const calculateTotalWeight = (items: PackingListItemWithGear[]) => {
    return items.reduce((total, item) => 
      total + (item.gear?.weight || item.personalGear?.weight || 0) * item.quantity, 0
    );
  };

  // 既存のコピーと共有機能を各パッキングリストに適用
  const generatePackingListText = (list: PackingListWithItems) => {
    let text = `パッキングリスト: ${list.name}\n\n総重量: ${(calculateTotalWeight(list.items) / 1000).toFixed(2)}kg\n\n`;
    const itemsByCategory = groupByCategory(list.items);
    Object.entries(itemsByCategory).forEach(([category, items]) => {
      text += `【${category}】\n`;
      items.forEach((item) => {
        const gear = item.gear || item.personalGear;
        text += `・${gear?.name} (${gear?.weight}g) x ${item.quantity}\n`;
      });
      text += '\n';
    });
    return text;
  };

  const copyToClipboard = (list: PackingListWithItems) => {
    const text = generatePackingListText(list);
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('リストをクリップボードにコピーしました！');
      setTimeout(() => setCopySuccess(''), 3000);
    }, (err) => {
      console.error('コピーに失敗しました: ', err);
    });
  };

  const shareToLINE = (list: PackingListWithItems) => {
    const text = encodeURIComponent(generatePackingListText(list));
    window.open(`https://line.me/R/share?text=${text}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <RefreshOnRedirect />
      <DeleteMessageHandler />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <SearchSuggestionComponent 
        label=""
        placeholder="ギアを追加"
        buttonTxt="追加"
        // TODO しゅうせい idは新規の場合は付与されないため、listIdを追加
        onAddGear={(gear) => handleAddGear(1, gear)}
        searchLimit={5}
        inputClassName='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
        suggestionContainerClassName='bg-white border border-gray-300 rounded-md shadow-lg'
      />
      <h1 className="text-3xl font-bold mb-5">マイパッキングリスト</h1>
      {packingLists.map(list => (
        <div key={list.id} className="mb-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">{list.name}</h2>
          <p className="text-gray-600 mb-4">山行: {list.trip?.name || '未設定'}</p>
          <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-lg shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">総重量</h3>
                <p className="text-4xl font-bold text-white">
                  {(calculateTotalWeight(list.items) / 1000).toFixed(2)}
                  <span className="text-2xl ml-2">kg</span>
                </p>
              </div>
              <div className="text-white opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-4 mb-4">
            <button
              onClick={() => copyToClipboard(list)}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              コピー
            </button>
            <button
              onClick={() => shareToLINE(list)}
              className="flex items-center justify-center bg-[#00B900] hover:bg-[#009900] text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで共有
            </button>
          </div>
          {copySuccess && <p className="mt-2 text-green-600">{copySuccess}</p>}
          {Object.entries(groupByCategory(list.items)).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item) => {
                  const gear = item.gear || item.personalGear;
                  return (
                    <div key={item.id} className="border rounded-lg p-4 shadow-sm">
                      <Link href={`/gear/${gear?.id}`}>
                        <h4 className="text-sm font-semibold mb-2 line-clamp-2 h-10">{gear?.name}</h4>
                        <div className="w-full bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                          <Image
                            src={gear?.img || '/logo.png'}
                            alt={gear?.name || 'Gear Image'}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-md duration-300 hover:scale-105"
                          />
                        </div>
                      </Link>
                      <p className="text-sm mb-2">重量: {gear?.weight || '不明'}g x {item.quantity}</p>
                      <button
                        onClick={() => handleRemoveGear(list.id, item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function groupByCategory(items: PackingListItemWithGear[]) {
  return items.reduce((acc, item) => {
    const category = item.gear?.category?.name || item.personalGear?.category?.name || '未分類';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PackingListItemWithGear[]>);
}
