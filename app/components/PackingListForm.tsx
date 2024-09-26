// components/PackingListForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const PackingListForm = ({ onSubmit }) => {
  const { register, handleSubmit, control, setValue, watch } = useForm();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const searchTrip = async (tripName) => {
    if (tripName.length < 2) return;
    const response = await fetch('/api/search-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripName }),
    });
    const data = await response.json();
    if (Array.isArray(data)) {
      setSuggestions(data);
    } else {
      console.error('Unexpected data format:', data);
      setSuggestions([]);
    }
  };

  const selectPoi = (poi) => {
    setSelectedPoi(poi);
    setValue('tripName', poi.name);
    setValue('elevation', poi.elevation);
    setValue('lat', poi.lat);
    setValue('lon', poi.lon);
    setValue('area', poi.area);
    setSuggestions([]);
  };

  const handleFormSubmit = (data) => {
    const tripInfo = selectedPoi ? {
      ...selectedPoi,
      season: data.season,
      detail: data.detail
    } : {
      name: data.tripName,
      elevation: data.elevation,
      lat: data.lat,
      lon: data.lon,
      area: data.area,
      season: data.season,
      detail: data.detail
    };
    onSubmit({ ...data, tripInfo });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <input {...register('name', { required: true })} placeholder="パッキングリスト名" />
      
      <input 
        {...register('tripName', { required: true })} 
        placeholder="山行名" 
        onChange={(e) => searchTrip(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((poi) => (
            <li key={poi.ptid} onClick={() => selectPoi(poi)}>
              {poi.name} ({poi.elevation}m, {poi.area})
            </li>
          ))}
        </ul>
      )}

      <input {...register('elevation')} placeholder="標高 (m)" type="number" />
      <input {...register('lat')} placeholder="緯度" type="number" step="any" />
      <input {...register('lon')} placeholder="経度" type="number" step="any" />
      <input {...register('area')} placeholder="エリア" />

      <Controller
        name="season"
        control={control}
        defaultValue="UNSPECIFIED"
        render={({ field }) => (
          <select {...field}>
            <option value="SPRING">春</option>
            <option value="SUMMER">夏</option>
            <option value="AUTUMN">秋</option>
            <option value="WINTER">冬</option>
            <option value="UNSPECIFIED">未指定</option>
          </select>
        )}
      />

      <textarea {...register('detail')} placeholder="詳細情報" />

      <button type="submit">パッキングリストを作成</button>
    </form>
  );
};

export default PackingListForm;
