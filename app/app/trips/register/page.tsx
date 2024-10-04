'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { AREA_LIST, AreaItem } from '@/app/types/areaList';
import { FormattedPoi } from '@/app/types/trips'




export default function RegisterTrip() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<FormattedPoi[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    detail: '',
    elevation: '',
    area: '',
    areaId: '',
  });
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tripData = {
        ...formData,
        elevation: formData.elevation ? parseInt(formData.elevation, 10) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        router.push('/trips');
      } else {
        throw new Error('Failed to register trip');
      }
    } catch (error) {
      console.error('Error registering trip:', error);
      setError("登録に失敗しました")
    }
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch('/api/search-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tripName: query }),
      });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSuggestions(formData.name);
    }, 300);

    return () => clearTimeout(debounce);
  }, [formData.name, fetchSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setSuggestions([]);
    }
  };
  // 0から5000mまでの500m刻みの選択肢を生成
  const elevationOptions = Array.from({ length: 11 }, (_, i) => i * 500);

  // 最も近い500の倍数に丸める関数
  const roundToNearest500 = (num: number) => Math.round(num / 500) * 500;

  // エリアIDとエリア名をセット
  const setAreaAndId = (areaId: string, areaName: string) => {
    setFormData(prev => ({ ...prev, area: areaName, areaId: areaId }));
  };

  // サジェスチョンされたエリアからエリア名をセット
  const setAreaFromSuggestion = (suggestionArea: string) => {
    const matchedArea = AREA_LIST.find(area => area.area_id === suggestionArea);
    if (matchedArea) {
      setAreaAndId(matchedArea.area_id, matchedArea.area);
    } else {
      // マッチするエリアが見つからない場合、エリアをクリアします
      setAreaAndId('', '');
    }
  };
  // エリアIDからエリア名を取得する関数
  const getAreaNameById = (areaId: string): string => {
    const matchedArea = AREA_LIST.find(area => area.area_id === areaId);
    return matchedArea ? matchedArea.area : areaId; // マッチするエリアが見つからない場合、元のareaIdを返す
  };


  if (error) {
    <div>{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">旅程を登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">旅程名</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {isSearching && (
              <div className="absolute right-2 top-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded-b mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.ptid}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const roundedElevation = roundToNearest500(suggestion.elevation);
                      setFormData({
                        ...formData,
                        name: suggestion.name,
                        elevation: roundedElevation.toString(),
                        area: suggestion.area,
                      });
                      setAreaFromSuggestion(suggestion.area)
                      setSuggestions([]);
                    }}
                  >
                    <p><strong>{suggestion.name}</strong> ({suggestion.elevation}m) エリア: {getAreaNameById(suggestion.area)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="startDate" className="block mb-1">開始日</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1">終了日</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="detail" className="block mb-1">詳細</label>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="elevation" className="block mb-1">標高 (m)</label>
          <select
            id="elevation"
            name="elevation"
            value={formData.elevation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            {elevationOptions.map((option) => (
              <option key={option} value={option.toString()}>{option}m 級</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="area" className="block mb-1">エリア</label>
          <select
            id="area"
            name="area"
            value={formData.areaId}
            onChange={(e) => {
              const selectedAreaName = getAreaNameById(e.target.value);
              if (selectedAreaName) {
                setAreaAndId(e.target.value, selectedAreaName);
              }
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            {AREA_LIST.map((area: AreaItem) => (
              <option key={area.area_id} value={area.area_id}>
                {area.area}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            登録
          </button>
          <Link href="/trips" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
