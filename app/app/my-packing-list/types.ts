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
  startDate?: Date | null;
  endDate?: Date | null;
  user: User;
  packingLists?: PackingList[];  // 追加
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
  altCategoryId?: number;
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
  altName?: string;
  altWeight?: number;
  altCategoryId?: number
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
  trips: Trip[];  // Trip[]型に変更
  tripIds?: number[];  // 追加
}

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'UNSPECIFIED';
