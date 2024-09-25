// app/public-packing-lists/PublicPackingListsClient.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

interface PublicPackingListsClientProps {
  packingLists: any[];
  currentUserId: string | undefined;
}

export default function PublicPackingListsClient({ packingLists: initialPackingLists, currentUserId }: PublicPackingListsClientProps) {
  const [packingLists, setPackingLists] = useState(initialPackingLists);

  const handleLike = async (listId: number) => {
    const response = await fetch(`/api/packing-lists/${listId}/like`, {
      method: 'POST',
    });

    if (response.ok) {
      setPackingLists(packingLists.map(list => 
        list.id === listId 
          ? {...list, _count: {...list._count, likes: list._count.likes + 1}}
          : list
      ));
    }
  };

  return (
    <div>
      <h1>人気のパッキングリスト</h1>
      {packingLists.map((list) => (
        <div key={list.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-bold">{list.name}</h2>
          <p>作成者: {list.user.name}</p>
          <p>山行: {list.trip?.name || '未設定'}</p>
          <p>アイテム数: {list.items.length}</p>
          <p>いいね数: {list._count.likes}</p>
          {currentUserId && currentUserId !== list.userId && (
            <button onClick={() => handleLike(list.id)}>いいね！</button>
          )}
          <Link href={`/packing-list/${list.id}`} className="text-blue-500 hover:underline">
            詳細を見る
          </Link>
        </div>
      ))}
    </div>
  )
}
