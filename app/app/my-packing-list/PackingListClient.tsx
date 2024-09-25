'use client'

import React, { useState } from 'react';

import GearSelector from '@/components/GearSelector';
import PackingListDisplay from '@/components/PackingListDisplay';
import PackingListForm from '@/components/PackingListForm';


interface PackingListClientProps {
  initialPackingLists: any[] // 適切な型に置き換えてください
}

const PackingListClient = ({ initialPackingLists }: PackingListClientProps) => {
  const [packingList, setPackingList] = useState(initialPackingLists);

  const handleCreatePackingList = async (data) => {
    const response = await fetch('/api/packing-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const newPackingList = await response.json();
    setPackingList(newPackingList);
  };

  const handleAddGear = async (data) => {
    const response = await fetch('/api/packing-list/add-gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, packingListId: packingList.id }),
    });
    const updatedPackingList = await response.json();
    setPackingList(updatedPackingList);
  };

  return (
    <div>
      <h1>パッキングリスト作成</h1>
      <PackingListForm onSubmit={handleCreatePackingList} />
      {packingList && (
        <>
          <GearSelector gears={initialPackingLists} onAddGear={handleAddGear} />
          <PackingListDisplay packingList={packingList} />
        </>
      )}
    </div>
  );
};

export default PackingListClient;
