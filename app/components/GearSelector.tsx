// components/GearSelector.tsx
import React from 'react';
import { useForm } from 'react-hook-form';

const GearSelector = ({ gears, onAddGear }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    onAddGear(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('gearId', { required: true })}>
        {gears.map((gear) => (
          <option key={gear.id} value={gear.id}>
            {gear.name} ({gear.weight}g)
          </option>
        ))}
      </select>
      <input {...register('quantity', { required: true, min: 1 })} type="number" defaultValue={1} />
      <button type="submit">追加</button>
    </form>
  );
};

export default GearSelector;
