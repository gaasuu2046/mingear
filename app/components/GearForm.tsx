'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { AutocompleteField } from './AutocompleteField';
import { FormField } from './FormField';

export default function GearForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);
  const [brand, setBrand] = useState('');
  const [brandID, setBrandID] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);     
        } else {
          console.error('カテゴリーの取得に失敗しました');
        }
      } catch (error) {
        console.error('カテゴリーの取得中にエラーが発生しました:', error);
      }
    };
    fetchCategories();
  }, []);

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

  // 画像urlのチェック
  const checkImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      setIsImageValid(false);
      console.error('画像URLのチェック中にエラーが発生しました:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 画像urlのチェック  
    const isValidImageUrl = await checkImageUrl(img);
    if (!isValidImageUrl) {
      setIsImageValid(false);
      alert('指定された画像URLが無効です。有効な画像URLを入力してください。');
      return;
    }

    try {
      const response = await fetch('/api/gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          categoryID, 
          brandID: isNewBrand ? null : brandID,
          brandName: isNewBrand ? newBrand : null,
          img, 
          price: parseInt(price, 10),
          weight: parseInt(weight, 10),
          productUrl
        }),
      });

      if (response.ok) {
        setName('');
        setDescription('');
        setCategory('');
        setCategoryID('');
        setBrand('');
        setBrandID('');
        setImg('');
        setPrice('');
        setWeight('');
        setProductUrl('');
        setIsNewBrand(false);
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        alert(`ギアの登録に失敗しました: ${errorData.message || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('ギアの登録中にエラーが発生しました:', error);
      alert('ギアの登録中にエラーが発生しました');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">登録成功！</h2>
        <p className="mb-4 text-black">新しいギアが正常に登録されました。</p>
        <Link href="/gear" className="text-blue-500 hover:underline">
          ギア一覧ページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-black mb-6">新しいギアを登録</h2>
        
        <FormField
          label="商品名"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NeoAir®︎UBERLITE small"
          required
        />

        <FormField
          label="説明"
          id="description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="軽量でコンパクトなエアーマット"
          required
        />

        <FormField
          label="カテゴリー"
          id="category"
          type="select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            const selectedCategory = categories.find(c => c.name === e.target.value);
            setCategoryID(selectedCategory ? selectedCategory.id : '');
          }}
          required
          options={categories.map(c => c.name)}
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
            required
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
            required
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
          label="画像URL"
          id="img"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="https://img.sample.com"
          required
          error={!isImageValid ? "無効な画像URLです" : ""}
        />

        <FormField
          label="価格 (円)"
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="38500"
          required
          min="0"
          step="1"
        />

        <FormField
          label="重量 (g)"
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="178"
          required
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          登録
        </button>
      </form>
    </div>
  );
}
