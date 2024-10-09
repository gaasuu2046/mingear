import Link from 'next/link'
import { Session } from "next-auth"
import { getServerSession } from 'next-auth/next'
import { Suspense } from 'react'

import { PackingList, Trip } from './types' // PackingListの型をインポート

import PackingListClientWrapper from '@/app/my-packing-list/PackingListClientWrapper'
import { Season } from '@/app/types/season'
import LoadingSpinner from '@/components/LoadingSpinner'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getPackingList(userId: string): Promise<PackingList[]> {
  try {
    const packingListRaw = await prisma.packingList.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            gear: true,
            personalGear: true
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: true,
        trips: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // prismaの返り値をPackingList型に変換
    const packingList: PackingList[] = packingListRaw.map(list => ({
      user: { id: list.user.id, name: list.user.name, image: list.user.image },
      id: list.id,
      name: list.name,
      detail: list.detail || undefined,
      season: list.season as Season,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
      items: list.items.map(item => ({
        id: item.id,
        gear: item.gear ? { ...item.gear } : undefined,
        personalGear: item.personalGear ? { ...item.personalGear } : undefined,
        quantity: item.quantity,
        type: item.gear ? 'public' : 'personal',
        altName: item.altName || undefined,
        altWeight: item.altWeight || undefined,
        altCategoryId: item.altCategoryId || undefined
      })),
      likes: list.likes.map(like => ({ id: like.id })),
      trips: list.trips.map(trip => ({
        ...trip,
        user: list.user // Add user property to match the Trip type
      })),
      tripId: list.trips[0]?.id ?? null, // trips は配列なので、最初の要素を取得
    }));

    return packingList;
  } catch (error) {
    console.error('Failed to fetch packing lists:', error);
    throw new Error('Failed to fetch packing lists');
  }
}

async function getTrips(userId: string): Promise<Trip[]> {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
    return trips;
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    throw new Error('Failed to fetch trips');
  }
}

export default async function MyPackingList() {
  const session = await getServerSession(authOptions) as Session | null

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">パッキングリストを利用するにはログインしてください。</p>
          <Link
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  try {
    // ユーザーのパッキングリストを取得
    const initialPackingList = await getPackingList(session.user.id);
    // ユーザーの旅程を取得
    const trips = await getTrips(session.user.id);

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PackingListClientWrapper initialPackingLists={initialPackingList} userId={session.user.id} trips={trips} />;
      </Suspense>
    )
  } catch (error) {
    console.error('Error fetching packing lists:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-black">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
          <p className="mb-6">パッキングリストの取得中にエラーが発生しました。後でもう一度お試しください。</p>
        </div>
      </div>
    );
  }
}
