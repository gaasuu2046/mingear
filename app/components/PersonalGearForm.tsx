// components/PersonalGearForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { FormField } from './FormField';

export default function PersonalGearForm() {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [brand, setBrand] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');
  const [productUrl, setProductUrl] = useState('');

  const { data: session } = useSession();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('ログインが必要です');
      router.push('/api/auth/signin');
      return;
    }

    try {
      const response = await fetch('/api/personal-gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          weight: parseInt(weight, 10),
          categoryId: categoryId ? parseInt(categoryId, 10) : null,
          brand,
          img,
          price: price ? parseInt(price, 10) : null,
          productUrl
        }),
      });

      if (response.ok) {
        alert('ギアが正常に登録されました');
        router.push('/my-gear');  // 持ってるギアリストページにリダイレクト
      } else {
        const errorData = await response.json();
        alert(`ギアの登録に失敗しました: ${errorData.message || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('ギアの登録中にエラーが発生しました:', error);
      alert('ギアの登録中にエラーが発生しました');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-black mb-6">持ってるギアを登録</h2>
        
        <FormField
          label="アイテム名"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NeoAir®︎UBERLITE small"
          required
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
          label="カテゴリー"
          id="category"
          type="select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            const selectedCategory = categories.find(c => c.name === e.target.value);
            setCategoryId(selectedCategory ? selectedCategory.id : '');
          }}
          options={categories.map(c => c.name)}
        />

        <FormField
          label="ブランド"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="THERM-A-REST"
        />

        <FormField
          label="画像URL (任意)"
          id="img"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="https://img.sample.com"
        />

        <FormField
          label="価格 (円) (任意)"
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="38500"
          min="0"
          step="1"
        />

        <FormField
          label="外部ページの製品へのリンク (任意)"
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
  );
}