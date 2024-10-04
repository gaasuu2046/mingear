'use client';

import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PackingList = {
  id: number;
  name: string;
};

type Trip = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  area: string | null;
  elevation: number | null;
  packingList: PackingList | null;
};

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError('トリップの取得に失敗しました');
        console.error('Error fetching trips:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">あなたのトリップ</h1>
      <Link href="/trips/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block">
        新しいトリップを登録
      </Link>
      {trips.length === 0 ? (
        <p>登録されているトリップはありません。</p>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li key={trip.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{trip.name}</h2>
              <p>期間: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
              {trip.area && <p>エリア: {trip.area}</p>}
              {trip.elevation && <p>標高: {trip.elevation}m</p>}
              {trip.packingList && (
                <p>
                  パッキングリスト:
                  <Link href={`/my-packing-list/${trip.packingList.id}`} className="text-blue-500 hover:underline ml-1">
                    {trip.packingList.name}
                  </Link>
                </p>
              )}
              {/* <div className="mt-2 space-x-2">
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                >
                  詳細を見る
                </button>
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
