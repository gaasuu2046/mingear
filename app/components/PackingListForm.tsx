// components/PackingListForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const PackingListForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors } = useForm();
  const [tripInfo, setTripInfo] = useState(null);

  const searchTrip = async (tripName) => {
    const response = await fetch('/api/search-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripName }),
    });
    const data = await response.json();
    setTripInfo(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} placeholder="パッキングリスト名" />
      <input {...register('tripName', { required: true })} placeholder="山行名" onBlur={(e) => searchTrip(e.target.value)} />
      {tripInfo && (
        <div>
          <p>山名: {tripInfo.name}</p>
          <p>標高: {tripInfo.elevation}m</p>
          <p>エリア: {tripInfo.area}</p>
          <p>季節: {tripInfo.season}</p>
        </div>
      )}
      <button type="submit">パッキングリストを作成</button>
    </form>
  );
};

export default PackingListForm;
