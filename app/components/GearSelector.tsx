// components/GearSelector.tsx
import React from 'react';
import { useForm } from 'react-hook-form';

interface Gear {
  id: number;
  name: string;
  weight: number;
}

interface GearSelectorProps {
  gears: Gear[];
  onAddGear: (data: { gearId: number; quantity: number }) => void;
}

const GearSelector: React.FC<GearSelectorProps> = ({ gears, onAddGear }) => {
  const { register, handleSubmit } = useForm<{ gearId: number; quantity: number }>();

  const onSubmit = (data: { gearId: number; quantity: number; }) => {
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
