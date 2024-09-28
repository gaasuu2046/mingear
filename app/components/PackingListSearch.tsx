// // components/PackingListSearch.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// import { AutocompleteField } from './AutocompleteField';

// interface Gear {
//   id: number;
//   name: string;
//   type: 'public' | 'personal';
// }

// export default function PackingListSearch() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState<Gear[]>([]);

//   useEffect(() => {
//     if (searchTerm.length > 2) {
//       fetchSuggestions();
//     } else {
//       setSuggestions([]);
//     }
//   }, [searchTerm]);

//   const fetchSuggestions = async () => {
//     try {
//       const response = await fetch(`/api/gear-search?term=${searchTerm}`);
//       if (response.ok) {
//         const data = await response.json();
//         setSuggestions(data);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     }
//   };

//   const handleAddToPackingList = async (gearId: number, type: 'public' | 'personal') => {
//     try {
//       const response = await fetch('/api/packing-list', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ gearId, type }),
//       });
//       if (response.ok) {
//         alert('アイテムがパッキングリストに追加されました');
//         setSearchTerm('');
//         setSuggestions([]);
//       }
//     } catch (error) {
//       console.error('Error adding to packing list:', error);
//     }
//   };

//   return (
//     <div>
//       <AutocompleteField
//         label="アイテムを検索"
//         id="gear-search"
//         value={searchTerm}
//         onChange={setSearchTerm}
//         options={suggestions.map(gear => gear.name)}
//         placeholder="アイテム名を入力"
//       />
//       {suggestions.length > 0 && (
//         <ul className="mt-2">
//           {suggestions.map(gear => (
//             <li key={gear.id} className="flex justify-between items-center p-2 border-b">
//               <span>{gear.name} ({gear.type === 'public' ? '公開' : '個人'})</span>
//               <button
//                 onClick={() => handleAddToPackingList(gear.id, gear.type)}
//                 className="bg-blue-500 text-black px-2 py-1 rounded"
//               >
//                 追加
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
