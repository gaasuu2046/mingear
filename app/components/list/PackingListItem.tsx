// components/PackingListItem.tsx
import { Gear } from '@/app/public-packing-list/types'; // Gear 型をインポート

interface PackingListItemProps {
  item: {
    id: number;
    gear?: Gear | null; // Gear 型を使用
    personalGear?: Gear | null; // Gear 型を使用
    quantity: number;
  };
}

const PackingListItem: React.FC<PackingListItemProps> = ({ item }) => {
  const imgSrc = item.gear?.img || item.personalGear?.img;
  const name = item.gear?.name || item.personalGear?.name;
  const weight = item.gear?.weight || item.personalGear?.weight;

  return (
    <li className="flex justify-between items-center bg-gray-100 p-3 rounded">
      {imgSrc && <img src={imgSrc} alt={name} className="w-8 h-8 object-cover mr-3 rounded-sm" />}
      <span>{name}</span>
      <span className="text-gray-600">{weight ? `${weight}g × ${item.quantity}` : 'N/A'}</span>
    </li>
  );
};

export default PackingListItem;