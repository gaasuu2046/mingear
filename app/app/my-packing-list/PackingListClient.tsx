// app/my-packing-list/PackingListClient.tsx

'use client'

import { Gear, PersonalGear, Category } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import DeleteButton from './DeleteButton'
import DeleteMessageHandler from './DeleteMessageHandler'

import RefreshOnRedirect from '@/components/RefreshOnRedirect'
import { SearchSuggestionComponent } from '@/components/SearchSuggestionComponent'

interface GearWithCategory extends Gear {
  category: Category;
}

interface PersonalGearWithCategory extends PersonalGear {
  category: Category;
}

interface PackingListItem {
  id: number;
  userId: string;
  gearId: number | null;
  personalGearId: number | null;
  createdAt: Date;
  gear: GearWithCategory | null;
  personalGear: PersonalGearWithCategory | null;
}

// PackingListClient の props の型を定義
interface PackingListClientProps {
  initialGearByCategory: Record<string, PackingListItem[]>;
  initialTotalWeight: number;
}

export default function PackingListClient({ initialGearByCategory, initialTotalWeight }: PackingListClientProps) {
    const [copySuccess, setCopySuccess] = useState('');
    const [gearByCategory, setGearByCategory] = useState(initialGearByCategory);
    const [totalWeight, setTotalWeight] = useState(initialTotalWeight);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
      useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 2000); // 3秒後に自動的に閉じる
    
        return () => clearTimeout(timer);
      }, [onClose]);
    
      return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {message}
        </div>
      );
    };

    // サジェスチョンから選択されたギアをパッキングレシピとして登録する処理
    const handleAddGear = async (gear: Gear | PersonalGear) => {
      const isPersonalGear = 'userId' in gear;
      const response = await fetch('/api/packing-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gearId: isPersonalGear ? null : gear.id,
          personalGearId: isPersonalGear ? gear.id : null,
          type: isPersonalGear ? 'personal' : 'public',
          categoryId: gear.categoryId, // カテゴリIDを追加
        }),
      });

      if (response.ok) {
        const newPackingListItem = await response.json();
        // 画面にメッセージを表示
        setToastMessage('アイテムを追加しました！');
        updatePackingList(newPackingListItem);
      } else {
        setToastMessage('アイテムの追加に失敗しました'); // エラーメッセージをセット
        console.error('Failed to add to packing list:', response.statusText);
      }
    }

    const updatePackingList = (newItem: PackingListItem) => {
      console.log('Adding item to packing list:', newItem);
      const category = newItem.gear?.category?.name || newItem.personalGear?.category?.name || '未分類';
      setGearByCategory(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), newItem]
      }));
      setTotalWeight(prev => prev + (newItem.gear?.weight || newItem.personalGear?.weight || 0));
    }

    // パッキングリストをテキスト形式で生成
    const generatePackingListText = () => {
      let text = `パッキングリスト\n\n総重量: ${(totalWeight / 1000).toFixed(2)}kg\n\n`;
      Object.entries(gearByCategory).forEach(([category, items]) => {
        text += `【${category}】\n`;
        items.forEach((item) => {
          const gear = item.gear || item.personalGear;
          text += `・${gear?.name} (${gear?.weight}g)\n`;
        });
        text += '\n';
      });
      return text;
    }

    // クリップボードにコピー
    const copyToClipboard = () => {
      const text = generatePackingListText();
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess('リストをクリップボードにコピーしました！');
        setTimeout(() => setCopySuccess(''), 3000);
      }, (err) => {
        console.error('コピーに失敗しました: ', err);
      });
    }

    // LINEで共有
    const shareToLINE = () => {
      const text = encodeURIComponent(generatePackingListText());
      window.open(`https://line.me/R/share?text=${text}`, '_blank');
    }
    
    return (
    <div className="container mx-auto px-4 py-3">
      <RefreshOnRedirect />
      <DeleteMessageHandler />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <h1 className="text-3xl font-bold mb-5">パッキングレシピ</h1>
      <SearchSuggestionComponent 
        label=""
        placeholder="ギアを追加"
        buttonTxt="追加"
        onAddGear={handleAddGear}
        searchLimit={5}
        inputClassName='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
        suggestionContainerClassName='bg-white border border-gray-300 rounded-md shadow-lg'
      />
      <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-lg shadow-lg p-4 mt-2 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">総重量</h2>
            <p className="text-4xl font-bold text-white">
              {(totalWeight / 1000).toFixed(2)}
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
      {/* <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
        <h3 className="text-xl font-semibold mb-2 text-green-400">アイテムの追加方法</h3>
        <ul className="list-disc list-inside text-gray-300">
          <li>
            <Link href="/my-gear" className="text-blue-400 hover:underline">
              所有ギア一覧
            </Link>
            から追加する
          </li>
          <li>
            <Link href="/" className="text-blue-400 hover:underline">
              ギアカタログ
            </Link>
            から追加する
          </li>
        </ul>
        <p className="text-gray-300 mt-2">
          各アイテムの詳細ページで「パッキングレシピに追加」ボタンをクリックしてください。
        </p>
      </div> */}
      {/* リストのコピー機能 */}
      <div className="mt-6 flex space-x-4 mb-2">
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          コピー
        </button>
        <button
          onClick={shareToLINE}
          className="flex items-center justify-center bg-[#00B900] hover:bg-[#009900] text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
            <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          LINEで共有
        </button>
      </div>
      {copySuccess && <p className="mt-2 text-green-600">{copySuccess}</p>}
      {Object.entries(gearByCategory).map(([category, items]) => (
        <div key={category} className="mb-2">
          <h2 className="text-2xl font-semibold mb-2">{category}</h2>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-1">
            {items.map((item) => {
              const gear = item.gear || item.personalGear
              return (
                <div key={item.id} className="border rounded-lg p-1 shadow-sm">
                  <Link href={`/gear/${gear?.id}`}>
                    <h3 className="text-xs font-semibold mb-1 line-clamp-2 h-8">{gear?.name}</h3>
                    <div className="w-full bg-gray-200 rounded-md mb-1 flex items-center justify-center">
                        <Image
                          src={gear?.img || '/logo.png'}
                          alt={gear?.name || 'Gear Image'}
                          width={200}
                          height={50}
                          className="w-full h-20 sm:h-48 object-cover rounded-md duration-300 hover:scale-105"
                          objectFit="cover"
                        />
                    </div>
                  </Link>
                  <p className="text-white text-xs">重量: {gear?.weight || '不明'}g</p>
                  <DeleteButton id={item.id} className="text-sm" />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
