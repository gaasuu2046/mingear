// app/types/packingList.ts
export interface User {
  name: string | null;
  image: string | null;
}

export interface Trip {
  id: number;
  packingListId: number;
  name: string;
  detail: string | null;
  ptid: string | null;
  elevation: number | null;
  area: string | null;
  startDate: Date;
  endDate: Date;
}

export interface Gear {
  name: string;
  brand?: { name: string };
  img?: string | null;
  weight?: number;
}

export interface Item {
  id: number;
  quantity: number;
  gear?: Gear | null;
  personalGear?: Gear | null;
  altName?: string | null; // null を許容するように変更
  altWeight?: number | null; // null を許容するように変更
  altCategoryId?: number | null; // 必要に応じて追加
}

export interface PackingList {
  id: number;
  name: string;
  detail: string | null;
  user: User;
  trips: Trip[];
  items: Item[];
  season: string;
  userId: string;
  _count: { likes: number };
  isLikedByCurrentUser?: boolean;
  likes: { id: number; userId: string }[];
  createdAt: Date;
  updatedAt: Date;
  tripId?: number; // オプショナルに変更
}
