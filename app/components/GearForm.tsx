// components/GearForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormField } from './FormField';

export default function GearForm() {
  const router = useRouter();  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    const baseUrl = window.location.origin;

    const response = await fetch('/api/gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        description, 
        category, 
        brand, 
        img, 
        price: parseInt(price, 10) 
      }),
    });
    if (response.ok)  {
      setName('');
      setDescription('');
      setCategory('');
      setBrand('');
      setImg('');
      setPrice('');
      router.push(`${baseUrl}/gear`);
      return; 
    } else {
      // レスポンスの詳細を確認
      const errorData = await response.json();
      console.error('API error:', errorData);
      alert(`ギアの登録に失敗しました: ${errorData.message || '不明なエラー'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">新しいギアを登録</h2>
        
        <FormField
          label="名前"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormField
          label="説明"
          id="description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <FormField
          label="カテゴリー"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <FormField
          label="ブランド"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />

        <FormField
          label="画像URL"
          id="img"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          required
        />

        <FormField
          label="価格 (円)"
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="1"
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