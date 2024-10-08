// app/my-gear/PersonalGearList.tsx

'use client'

import { PersonalGear, Gear, Category, Brand } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
}

export default function PersonalGearList({ initialGearList }: PersonalGearListProps) {
  const [gearList, setGearList] = useState(initialGearList)
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [img, setImg] = useState('')
  const [price, setPrice] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [newBrand, setNewBrand] = useState('');
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);
  const [brandID, setBrandID] = useState('');
  const [isSearchSuggestionUsed, setIsSearchSuggestionUsed] = useState(false);
  const [isGearAdded, setIsGearAdded] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brand');
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        } else {
          console.error('ブランドの取得に失敗しました');
        }
      } catch (error) {
        console.error('ブランドの取得中にエラーが発生しました:', error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          console.error('カテゴリーの取得に失敗しました')
        }
      } catch (error) {
        console.error('カテゴリーの取得中にエラーが発生しました:', error)
      }
    }
    fetchCategories()
  }, [])


  // サジェスチョンから選択されたギアを所有ギアとして登録する処理
  const handleAddGear = async (gear: Gear) => {
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
      setGearList([...gearList, newPersonalGear])
      setIsGearAdded(true); // ギアが正常に追加されたことを示す
      resetForm()
    }
  }
  const handleNameChange = (newName: string) => {
    setName(newName);
    setIsSearchSuggestionUsed(false);
  };

  const handleAddCustomGear = async (e: React.FormEvent) => {
    if (isGearAdded) {
      // すでにギアが追加されている場合は、この関数を終了します
      return;
    }
    e.preventDefault()

    const response = await fetch('/api/my-gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        weight: parseInt(weight),
        brandID: isNewBrand ? null : brandID,
        brandName: isNewBrand ? newBrand : null,
        categoryId: parseInt(categoryID),
        img,
        price: price ? parseInt(price) : null,
        productUrl,
      }),
    })

    if (response.ok) {
      const newPersonalGear = await response.json()
      setGearList([...gearList, newPersonalGear])
      resetForm()
    }
  }

  const resetForm = () => {
    setName('')
    setWeight('')
    setBrand('')
    setCategory('')
    setCategoryID('')
    setImg('')
    setPrice('')
    setProductUrl('')
    setShowAddForm(false)
  }

  // ギアをカテゴリ毎にグループ化
  const gearByCategory = gearList.reduce((acc, item) => {
    const category = item.category?.name || 'その他'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, PersonalGear[]>)

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
              searchLimit={5} inputClassName='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
            />

            <FormField
              label="重量 (g)"
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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
                  value={brand}
                  onChange={(value) => {
                    setBrand(value);
                    const selectedBrand = brands.find(b => b.name === value);
                    setBrandID(selectedBrand ? selectedBrand.id : '');
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
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                const selectedCategory = categories.find(c => c.name === e.target.value)
                setCategoryID(selectedCategory ? selectedCategory.id : '')
              }}
              required={!isSearchSuggestionUsed}
              options={categories.map(c => c.name)}
            />

            <FormField
              label="画像URL"
              id="img"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://img.sample.com"
            />

            <FormField
              label="価格 (円)"
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="38500"
              min="0"
              step="1"
            />

            <FormField
              label="外部ページの製品へのリンク"
              id="productUrl"
              type="text"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
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
      {Object.entries(gearByCategory).map(([category, items]) => (
        <div key={category} className="mb-1">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg shadow-sm">
                <Link href={`/gear/${item.gearId}`}>
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2 h-10">{item.name}</h3>
                  <Image
                    src={item.img || '/logo.png'}
                    alt={item.name}
                    width={200}
                    height={100}
                    className="w-full h-32 sm:h-48 object-cover rounded-md mb-4"
                  />
                </Link>
                <p className="text-gray-600">重量: {item.weight}g</p>
                <div className="p-1 flex flex-col">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <AddToPackingListButton
                      gearId={item.id}
                      type="personal"
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="flex-1 mb-2 sm:mb-0">
                    <DeleteButton
                      id={item.id}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
