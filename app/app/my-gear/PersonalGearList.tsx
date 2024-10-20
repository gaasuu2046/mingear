// app/my-gear/PersonalGearList.tsx

'use client'

import { PersonalGear, Gear, Category, Brand } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback, useMemo } from 'react'
import React from 'react'
import { FixedSizeList as List } from 'react-window'

import DeleteButton from './DeleteButton'

import { AutocompleteField } from '@/components/AutocompleteField'
import AddToPackingListButton from '@/components/button/AddToPackingListButton'
import { FormField } from '@/components/form/FormField'
import { SearchSuggestionComponent } from '@/components/suggestion/SearchSuggestionComponent'

interface PersonalGearWithRelations extends PersonalGear {
  category: Category;
  brand: Brand | null;
}

interface PersonalGearListProps {
  initialGearList: PersonalGearWithRelations[]
  initialCategories: Category[]
  initialBrands: Brand[]
}

export default function PersonalGearList({ initialGearList, initialCategories, initialBrands }: PersonalGearListProps) {
  const [gearList, setGearList] = useState(initialGearList)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    brand: '',
    category: '',
    categoryID: '',
    img: '',
    price: '',
    productUrl: '',
  })
  const [categories] = useState(initialCategories)
  const [brands] = useState(initialBrands)
  const [newBrand, setNewBrand] = useState('')
  const [isNewBrand, setIsNewBrand] = useState(false)
  const [brandID, setBrandID] = useState('')
  const [isSearchSuggestionUsed, setIsSearchSuggestionUsed] = useState(false)
  const [isGearAdded, setIsGearAdded] = useState(false)

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      weight: '',
      brand: '',
      category: '',
      categoryID: '',
      img: '',
      price: '',
      productUrl: '',
    })
    setShowAddForm(false)
    setIsNewBrand(false)
    setBrandID('')
    setNewBrand('')
    setIsGearAdded(false)
    setIsSearchSuggestionUsed(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleAddGear = useCallback(async (gear: Gear) => {
    setIsSearchSuggestionUsed(true)
    const response = await fetch('/api/my-gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: gear.name,
        gearId: gear.id,
        weight: gear.weight,
        brandId: gear.brandId,
        categoryId: gear.categoryId,
        img: gear.img,
        price: gear.price,
        productUrl: gear.productUrl,
      }),
    })

    if (response.ok) {
      const newPersonalGear = await response.json()
      setGearList(prev => [...prev, newPersonalGear])
      setIsGearAdded(true)
      resetForm()
    }
  }, [resetForm])

  const handleNameChange = useCallback((newName: string) => {
    setFormData(prev => ({ ...prev, name: newName }))
    setIsSearchSuggestionUsed(false)
  }, [])

  const handleAddCustomGear = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isGearAdded) return

    const response = await fetch('/api/my-gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        weight: parseInt(formData.weight),
        brandID: isNewBrand ? null : brandID,
        brandName: isNewBrand ? newBrand : null,
        categoryId: parseInt(formData.categoryID),
        img: formData.img,
        price: formData.price ? parseInt(formData.price) : null,
        productUrl: formData.productUrl,
      }),
    })

    if (response.ok) {
      const newPersonalGear = await response.json()
      setGearList(prev => [...prev, newPersonalGear])
      resetForm()
    }
  }, [formData, isGearAdded, isNewBrand, brandID, newBrand, resetForm])


  const gearByCategory = useMemo(() => {
    return gearList.reduce((acc, item) => {
      const category = item.category?.name || 'その他'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {} as Record<string, PersonalGearWithRelations[]>)
  }, [gearList])

  const GearItem = useCallback(({ item }: { item: PersonalGearWithRelations }) => (
    <div className="border rounded-lg shadow-sm">
      <Link href={`/gear/${item.gearId}`}>
        <h3 className="text-sm font-semibold mb-2 line-clamp-2 h-10">{item.name}</h3>
        <Image
          src={item.img || '/logo.png'}
          alt={item.name}
          width={200}
          height={100}
          className="w-full h-32 sm:h-48 object-cover rounded-md mb-4"
          loading="lazy"
        />
      </Link>
      <p className="text-gray-600">重量: {item.weight}g</p>
      <div className="p-1 flex flex-col">
        <AddToPackingListButton
          gearId={item.id}
          type="personal"
          className="w-full text-sm"
        />
        <DeleteButton
          id={item.id}
          className="w-full text-sm"
        />
      </div>
    </div>
  ), [])

  const MemoizedGearItem = useMemo(() => React.memo(GearItem), [GearItem])

  const Row = useCallback(({ index, style }: { index: number, style: React.CSSProperties }) => {
    const [category, items] = Object.entries(gearByCategory)[index]
    return (
      <div style={style}>
        <h2 className="text-2xl font-semibold mb-4">{category}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => <MemoizedGearItem key={item.id} item={item} />)}
        </div>
      </div>
    )
  }, [gearByCategory, MemoizedGearItem])

  return (
    <div>
      <button
        onClick={() => setShowAddForm(true)}
        className="mb-6 bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600"
      >
        所有ギアを登録
      </button>

      {showAddForm && (
        <div className="mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg w-full max-w-2xl">
          <form onSubmit={handleAddCustomGear} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-black mb-6">新しいギアを登録</h2>
            <SearchSuggestionComponent
              label="商品名"
              placeholder="商品名を入力"
              buttonTxt="追加"
              onAddGear={handleAddGear}
              type="public"
              onNameChange={handleNameChange}
              searchLimit={5}
              inputClassName='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
            />

            <FormField
              label="重量 (g)"
              id="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="178"
              required={!isSearchSuggestionUsed}
              min="0"
              step="1"
            />
            {!isNewBrand ? (
              <>
                <AutocompleteField
                  label="ブランド"
                  id="brand"
                  value={formData.brand}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, brand: value }))
                    const selectedBrand = brands.find(b => b.name === value)
                    setBrandID(selectedBrand ? selectedBrand.id.toString() : '')
                  }}
                  options={brands.map(b => b.name)}
                  placeholder="THERM-A-REST"
                  onInvalid={(e: React.InvalidEvent<HTMLInputElement>) =>
                    e.target.setCustomValidity('ブランドを選択するか、新しいブランドを入力してください。')}
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    e.currentTarget.setCustomValidity('')}
                />
                <button
                  type="button"
                  onClick={() => setIsNewBrand(true)}
                  className="text-blue-500 hover:underline"
                >
                  新しいブランドを追加
                </button>
              </>
            ) : (
              <>
                <FormField
                  label="新しいブランド名"
                  id="newBrand"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="新しいブランド名を入力"
                  required={!isSearchSuggestionUsed}
                  onInvalid={(e: React.InvalidEvent<HTMLInputElement>) =>
                    e.target.setCustomValidity('新しいブランドを入力してください。また、自作ギアの場合は`MYOG`を選択してください。')}
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    e.currentTarget.setCustomValidity('')}
                />
                <button
                  type="button"
                  onClick={() => setIsNewBrand(false)}
                  className="text-blue-500 hover:underline"
                >
                  既存のブランドを選択
                </button>
              </>
            )}
            <FormField
              label="カテゴリー"
              id="category"
              type="select"
              value={formData.category}
              onChange={(e) => {
                const selectedCategory = categories.find(c => c.name === e.target.value)
                setFormData(prev => ({
                  ...prev,
                  category: e.target.value,
                  categoryID: selectedCategory ? selectedCategory.id.toString() : ''
                }))
              }}
              required={!isSearchSuggestionUsed}
              options={categories.map(c => c.name)}
            />

            <FormField
              label="画像URL"
              id="img"
              value={formData.img}
              onChange={handleInputChange}
              placeholder="https://img.sample.com"
            />

            <FormField
              label="価格 (円)"
              id="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="38500"
              min="0"
              step="1"
            />

            <FormField
              label="外部ページの製品へのリンク"
              id="productUrl"
              type="text"
              value={formData.productUrl}
              onChange={handleInputChange}
              placeholder="https://sample.com"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              登録
            </button>
          </form>
        </div>
      )}
      <List
        height={600}
        itemCount={Object.keys(gearByCategory).length}
        itemSize={350}
        width="100%"
      >
        {Row}
      </List>
    </div>
  )
}
