import { User } from "next-auth";

// types.ts
export interface Category {
  id: number;
  name: string;
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

export interface Gear {
  id: number;
  name: string;
  description: string;
  img: string;
  price: number | null;
  productUrl: string | null;
  weight: number;
  brandId: number;
  categoryId: number;
  avgRating: number | null;
  reviewCount: number;
  quantity?: number;
  type?: 'public' | 'personal';
}

export interface PersonalGear {
  id: number;
  userId: string;
  name: string;
  weight: number;
  categoryId: number;
  img: string | null;
  price: number | null;
  productUrl: string | null;
  brandId: number | null;
  gearId: number | null;
  description?: string;
  avgRating?: number | null;
  reviewCount?: number;
}

export interface PackingListItem {
  id: number;
  gear?: Gear;
  personalGear?: PersonalGear;
  quantity: number;
  type: 'public' | 'personal';
}

export interface PackingList {
  id: number;
  name: string;
  detail?: string;
  season: Season;
  createdAt: string;
  updatedAt: string;
  items: PackingListItem[];
  likes: { id: number }[];
  tripId?: number | null;
}

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'UNSPECIFIED';
