// /app/my-packing-list/GearAddModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react'
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

export default function GearAddModal({ isOpen, onClose, onAddGears, userId, existingGears }: GearAddModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [gearInputs, setGearInputs] = useState<{ [key: number]: Gear[] }>({})
  const [suggestions, setSuggestions] = useState<{ [key: number]: Gear[] }>({})
  const [appElement, setAppElement] = useState<HTMLElement | null>(null);

  
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
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
        const categoryGears = existingGears.filter(gear => gear.categoryId === category.id);
        acc[category.id] = categoryGears.length > 0 
          ? categoryGears 
          : [{ id: 0, name: '', weight: 0, quantity: 1, type: 'personal', categoryId: category.id, description: '', img: '', price: 0, productUrl: '', brandId: 0, avgRating: 0, reviewCount: 0 }];
        return acc;
      }, {} as { [key: number]: Gear[] });
      setGearInputs(initialGearInputs);
    }
  }, [categories, existingGears]);

  const fetchSuggestions = useCallback(async (query: string, categoryId: number) => {
    try {
      const response = await fetch(`/api/gear/search?q=${query}&userId=${userId}&categoryId=${categoryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      const data = await response.json()
      setSuggestions(prev => ({ ...prev, [categoryId]: data }))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }, [userId])

  const handleGearInput = useCallback((categoryId: number, index: number, field: keyof Gear, value: string | number) => {
    if (field === 'name' && typeof value === 'string' && value.length > 2) {
      fetchSuggestions(value, categoryId)
    } else if (field === 'name') {
      setSuggestions(prev => ({ ...prev, [categoryId]: [] }))
    }
    setGearInputs(prevInputs => {
      const updatedGears = [...prevInputs[categoryId]]
      const updatedGear = { ...updatedGears[index] }

      if (field === 'quantity') {
        updatedGear.quantity = Number(value)
      } else if (field === 'weight') {
        updatedGear.weight = Number(value)
      } else {
        updatedGear[field as keyof Gear] = value as never
      }

      updatedGears[index] = updatedGear
      return { ...prevInputs, [categoryId]: updatedGears }
    })
  }, [fetchSuggestions])

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
      const updatedGears = [...prevInputs[categoryId], newGear];
      return { ...prevInputs, [categoryId]: updatedGears };
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
    const allGears = Object.values(gearInputs).flat().filter(gear => gear.name.trim() !== '')
    onAddGears(allGears)
    onClose()
  }, [gearInputs, onAddGears, onClose])

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      appElement={appElement || undefined}
      style={customStyles}
      contentLabel="ギアを追加"
    >
      <h2 className="text-2xl font-bold mb-4">ギアを追加</h2>
      {categories.map((category) => (
        <div key={category.id} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
          <div className="grid grid-cols-4 gap-2 mb-2 font-semibold">
          <div>ギア名</div>
            <div>単品重量(g)</div>
            <div>数量</div>
            <div>総重量(g)</div>
            <div>操作</div>
          </div>
          {gearInputs[category.id]?.map((gear, index) => (
            <div key={index} className="mb-2 grid grid-cols-5 gap-2">
              <input
                type="text"
                value={gear.name}
                onChange={(e) => handleGearInput(category.id, index, 'name', e.target.value)}
                placeholder="ギア名"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={gear.weight === 0 ? '' : gear.weight}
                onChange={(e) => handleGearInput(category.id, index, 'weight', Number(e.target.value))}
                placeholder="単品重量"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={gear.quantity}
                onChange={(e) => handleGearInput(category.id, index, 'quantity', Number(e.target.value))}
                min="1"
                placeholder="数量"
                className="p-2 border rounded"
              />
              <div className="p-2 border rounded bg-gray-100">
                {gear.weight * (gear.quantity ?? 1)}
              </div>
              <button
                onClick={() => handleRemoveGear(category.id, index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                削除
              </button>
            </div>
          ))}
          {suggestions[category.id]?.length > 0 && (
            <ul className="mb-2 border rounded max-h-40 overflow-y-auto">
              {suggestions[category.id].map((suggestion) => (
                <li 
                  key={suggestion.id} 
                  onClick={() => handleGearSelect(category.id, gearInputs[category.id].length - 1, suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.name} ({suggestion.type === 'personal' ? '所有ギア' : 'カタログ'})
                </li>
              ))}
            </ul>
          )}
          <button 
            onClick={() => handleAddGear(category.id)}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {category.name}にギアを追加
          </button>
        </div>
      ))}
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
