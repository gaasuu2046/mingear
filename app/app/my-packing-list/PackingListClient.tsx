// app/my-packing-list/PackingListClient.tsx
'use client'

import React, { useState } from 'react';

import PackingListForm from '@/components/PackingListForm';

interface PackingListClientProps {
  initialPackingLists: any[]; // 適切な型に置き換えてください
  onNewList: (newList: any) => void;
  userId: string;
}

const PackingListClient: React.FC<PackingListClientProps> = ({ initialPackingLists, onNewList, userId }) => {
  const [currentPackingList, setCurrentPackingList] = useState(null);

  const handleCreatePackingList = async (data) => {
    const response = await fetch('/api/packing-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId }),
    });
    const newPackingList = await response.json();
    setCurrentPackingList(newPackingList);
    onNewList(newPackingList);
  };

  const handleAddGear = async (data) => {
    if (!currentPackingList) return;
    const response = await fetch(`/api/packing-list/${currentPackingList.id}/add-gear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data }),
    });
    const updatedPackingList = await response.json();
    setCurrentPackingList(updatedPackingList);
  };

  return (
    <div>
      <PackingListForm onSubmit={handleCreatePackingList} />
      {/* {currentPackingList && (
        <>
          <GearSelector gears={initialPackingLists} onAddGear={handleAddGear} />
          <PackingListDisplay packingList={currentPackingList} />
        </>
      )} */}
    </div>
  );
};

export default PackingListClient;
