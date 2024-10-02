import { User } from "next-auth";

// types.ts
export interface Category {
  id: number;
  name: string;
}

export interface Gear {
  id?: number;
  name: string;
  weight: number;
  quantity: number;  // quantity を追加
  type: 'public' | 'personal';
  categoryId: number;
}

export interface Trip {
  id: number;
  name: string;
  detail?: string | null;
  ptid?: string | null;
  elevation?: number | null;
  lat?: number | null;
  lon?: number | null;
  userId: string;
  area?: string | null;
  startDate?: Date | null;  // 追加
  endDate?: Date | null;    // 追加
  user: User;
}

export interface PackingListItem {
  id: number;
  gear?: Gear;
  personalGear?: Gear;
  quantity: number;
}

export interface PackingList {
  id: number;
  name: string;
  detail?: string;
  season: string;
  createdAt: string;
  updatedAt: string;
  items: PackingListItem[];
  likes: { id: number }[];
  tripId?: number | null;  // 旅程との紐づけ
}

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'UNSPECIFIED';
