// /app/my-packing-list/GearAddModal.tsx
"use client";

import { debounce } from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Modal from 'react-modal'

import { Gear, Category } from './types'


interface GearAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGears: (gears: Gear[]) => void;
  userId: string;
  existingGears: Gear[];
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
};

const GearRow = React.memo(function GearRow({
  categoryId,
  index,
  gear,
  onInput,
  onRemove,
  isActive,
  setActiveInput,
  suggestions,
  isFetchingSuggestions,
  onGearSelect
}: {
  categoryId: number,
  index: number,
  gear: Gear,
  onInput: (categoryId: number, index: number, field: keyof Gear, value: string | number) => void,
  onRemove: (categoryId: number, index: number) => void,
  isActive: boolean,
  setActiveInput: (input: { categoryId: number; index: number } | null) => void,
  suggestions: Gear[],
  isFetchingSuggestions: boolean,
  onGearSelect: (categoryId: number, index: number, gear: Gear) => void
}) {
  return (
    <div className="mb-2">
      <div className="grid grid-cols-5 gap-2">
        <input
          type="text"
          value={gear.name}
          onChange={(e) => onInput(categoryId, index, 'name', e.target.value)}
          onFocus={() => setActiveInput({ categoryId, index })}
          placeholder="ギア名"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={gear.weight === 0 ? '' : gear.weight}
          onChange={(e) => onInput(categoryId, index, 'weight', Number(e.target.value))}
          placeholder="単品重量"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={gear.quantity}
          onChange={(e) => onInput(categoryId, index, 'quantity', Number(e.target.value))}
          min="1"
          placeholder="数量"
          className="p-2 border rounded"
        />
        <div className="p-2 border rounded bg-gray-100">
          {gear.weight * (gear.quantity ?? 1)}
        </div>
        <button
          onClick={() => onRemove(categoryId, index)}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          削除
        </button>
      </div>
      {isActive && (suggestions.length > 0 || isFetchingSuggestions) && (
        <ul className="mt-1 border rounded max-h-40 overflow-y-auto">
          {isFetchingSuggestions && (
            <li className="p-2 text-gray-500">サジェストを取得中...</li>
          )}
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onGearSelect(categoryId, index, suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.name} ({suggestion.type === 'personal' ? '所有ギア' : 'カタログ'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default function GearAddModal({ isOpen, onClose, onAddGears, userId, existingGears }: GearAddModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [gearInputs, setGearInputs] = useState<{ [key: number]: Gear[] }>({})
  const [suggestions, setSuggestions] = useState<{ [key: number]: Gear[] }>({})
  const [appElement, setAppElement] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState<{ [key: number]: boolean }>({});
  const [activeInput, setActiveInput] = useState<{ categoryId: number; index: number } | null>(null);


  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppElement(document.body);
    }
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (categories.length > 0) {
      const initialGearInputs = categories.reduce((acc, category) => {
        const categoryGears = existingGears.filter(gear =>
          gear.categoryId === category.id ||
          (gear.type === undefined && gear.categoryId === category.id)
        );
        acc[category.id] = categoryGears.length > 0
          ? categoryGears
          : [{ id: 0, name: '', weight: 0, quantity: 1, type: undefined, categoryId: category.id, description: '', img: '', price: 0, productUrl: '', brandId: 0, avgRating: 0, reviewCount: 0 }];
        return acc;
      }, {} as { [key: number]: Gear[] });
      setGearInputs(initialGearInputs);
    }
  }, [categories, existingGears]);

  const fetchSuggestions = useCallback(async (query: string, categoryId: number) => {
    if (query.length <= 1) {
      setSuggestions(prev => ({ ...prev, [categoryId]: [] }));
      return;
    }
    setIsFetchingSuggestions(prev => ({ ...prev, [categoryId]: true }));
    try {
      const response = await fetch(`/api/gear/search?q=${query}&userId=${userId}&categoryId=${categoryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      const data = await response.json()
      setSuggestions(prev => ({ ...prev, [categoryId]: data }))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsFetchingSuggestions(prev => ({ ...prev, [categoryId]: false }));
    }
  }, [userId])

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 200),
    [fetchSuggestions]
  );

  const handleGearInput = useCallback((categoryId: number, index: number, field: keyof Gear, value: string | number) => {
    setGearInputs(prevInputs => {
      const updatedGears = [...prevInputs[categoryId]]
      const updatedGear = { ...updatedGears[index], [field]: value }
      if (field === 'name' && updatedGear.type === undefined) {
        updatedGear.id = 0
      }
      updatedGears[index] = updatedGear
      return { ...prevInputs, [categoryId]: updatedGears }
    })

    if (field === 'name' && typeof value === 'string') {
      debouncedFetchSuggestions(value, categoryId)
    }
  }, [debouncedFetchSuggestions])

  const handleGearSelect = useCallback((categoryId: number, index: number, gear: Gear) => {
    setGearInputs(prevInputs => {
      const updatedGears = [...prevInputs[categoryId]]
      updatedGears[index] = { ...gear, quantity: 1 }
      return { ...prevInputs, [categoryId]: updatedGears }
    })
    setSuggestions(prev => ({ ...prev, [categoryId]: [] }))
  }, [])

  const handleAddGear = useCallback((categoryId: number) => {
    setGearInputs(prevInputs => {
      const newGear: Gear = {
        id: 0,
        name: '',
        weight: 0,
        quantity: 1,
        type: 'personal',
        categoryId,
        description: '',
        img: '',
        price: 0,
        productUrl: '',
        brandId: 0,
        avgRating: 0,
        reviewCount: 0
      };
      return { ...prevInputs, [categoryId]: [...prevInputs[categoryId], newGear] };
    })
  }, [])

  const handleRemoveGear = useCallback((categoryId: number, index: number) => {
    setGearInputs(prevInputs => {
      const updatedGears = [...prevInputs[categoryId]]
      updatedGears.splice(index, 1)
      return { ...prevInputs, [categoryId]: updatedGears }
    })
  }, [])

  const handleSubmit = useCallback(() => {
    const allGears = Object.values(gearInputs).flat().filter(gear => gear.name.trim() !== '').map(gear => {
      if (gear.id === 0) {
        return { ...gear, type: undefined, altCategoryId: gear.categoryId };
      }
      return gear;
    });
    onAddGears(allGears)
    onClose()
  }, [gearInputs, onAddGears, onClose])

  const memoizedCategories = useMemo(() => categories, [categories]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={appElement || undefined}
      style={customStyles}
      contentLabel="ギアを追加"
    >
      <h2 className="text-2xl font-bold mb-4">ギアを追加</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {memoizedCategories.map((category) => (
            <div key={category.id} className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <div className="grid grid-cols-5 gap-2 mb-2 font-semibold">
                <div>ギア名</div>
                <div>単品重量(g)</div>
                <div>数量</div>
                <div>総重量(g)</div>
                <div>操作</div>
              </div>
              {gearInputs[category.id]?.map((gear, index) => (
                <GearRow
                  key={`${category.id}-${index}`}
                  gear={gear}
                  categoryId={category.id}
                  index={index}
                  onInput={handleGearInput}
                  onRemove={handleRemoveGear}
                  isActive={activeInput?.categoryId === category.id && activeInput?.index === index}
                  setActiveInput={setActiveInput}
                  suggestions={suggestions[category.id] || []}
                  isFetchingSuggestions={isFetchingSuggestions[category.id] || false}
                  onGearSelect={handleGearSelect}
                />
              ))}
              <button
                onClick={() => handleAddGear(category.id)}
                className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {category.name}にギアを追加
              </button>
            </div>
          ))}
        </>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleSubmit}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          登録
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          キャンセル
        </button>
      </div>
    </Modal>
  )
}
