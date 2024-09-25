import React from 'react';

const PackingListDisplay = ({ packingList }) => {
  if (!packingList || !packingList.items) {
    return <div>パッキングリストが見つかりません。</div>;
  }

  const totalWeight = packingList.items.reduce((acc: number, item: { gear: { weight: any; }; quantity: number; }) => {
    return acc + (item.gear?.weight || 0) * item.quantity;
  }, 0);

  return (
    <div>
      <h2>{packingList.name}</h2>
      <p>山行: {packingList.trip?.name || '未定'}</p>
      <p>エリア: {packingList.trip?.area || '未定'}</p>
      <p>季節: {packingList.trip?.season || '未定'}</p>
      <ul>
        {packingList.items.map((item) => (
          <li key={item.id}>
            {item.gear?.name || '未定のギア'} x {item.quantity} ({(item.gear?.weight || 0) * item.quantity}g)
          </li>
        ))}
      </ul>
      <p>総重量: {totalWeight}g</p>
    </div>
  );
};

export default PackingListDisplay;
