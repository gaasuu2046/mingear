// contexts/PackingListContext.tsx
import { Gear, PersonalGear, Category } from '@prisma/client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GearWithCategory extends Gear {
  category: Category;
}

interface PersonalGearWithCategory extends PersonalGear {
  category: Category;
}

interface PackingListItem {
  id: number;
  userId: string;
  gearId: number | null;
  personalGearId: number | null;
  createdAt: Date;
  gear: GearWithCategory | null;
  personalGear: PersonalGearWithCategory | null;
}

type PackingListContextType = {
  gearByCategory: Record<string, PackingListItem[]>;
  totalWeight: number;
  setGearByCategory: React.Dispatch<React.SetStateAction<Record<string, PackingListItem[]>>>;
  setTotalWeight: React.Dispatch<React.SetStateAction<number>>;
  removeItem: (itemId: number) => void;
};

const PackingListContext = createContext<PackingListContextType | undefined>(undefined);

export const PackingListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gearByCategory, setGearByCategory] = useState<Record<string, PackingListItem[]>>({});
  const [totalWeight, setTotalWeight] = useState(0);

  const removeItem = (itemId: number) => {
    setGearByCategory(prev => {
      const newGearByCategory = { ...prev };
      for (const category in newGearByCategory) {
        newGearByCategory[category] = newGearByCategory[category].filter(item => item.id !== itemId);
        if (newGearByCategory[category].length === 0) {
          delete newGearByCategory[category];
        }
      }
      return newGearByCategory;
    });

    setTotalWeight(prev => {
      const removedItem = Object.values(gearByCategory).flat().find(item => item.id === itemId);
      return prev - (removedItem?.gear?.weight || removedItem?.personalGear?.weight || 0);
    });
  };

  return (
    <PackingListContext.Provider value={{ gearByCategory, totalWeight, setGearByCategory, setTotalWeight, removeItem }}>
      {children}
    </PackingListContext.Provider>
  );
};

export const usePackingList = () => {
  const context = useContext(PackingListContext);
  if (context === undefined) {
    throw new Error('usePackingList must be used within a PackingListProvider');
  }
  return context;
};
