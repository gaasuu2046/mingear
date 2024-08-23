// app/gear/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'

import prisma from '@/lib/prisma'

async function getGearList() {
  const gearList = await prisma.gear.findMany()
  if (!gearList) notFound()
  return gearList
}
const gears = await getGearList();

export default function GearList({ limit }: { limit?: number }) {
  // limitが指定されている場合、ギアをレビューでソートし、上位limitまでを取得
  const displayedGears = limit
    ? [...gears].sort((a) => a.id).slice(0, limit)
    : gears;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mt-6">
        {limit ? `おすすめギア` : 'ギア一覧'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedGears.map((gear) => (
          <div key={gear.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{gear.name}</h2>
            <img src={gear.img} alt={gear.name} className="h-48 w-full object-cover object-center mb-2" />
            <p className="text-gray-600 mb-2">{gear.category}</p>
            <p className="text-gray-600 mb-2">{gear.price}円</p>
            <Link href={`/gear/${gear.id}`} className="text-blue-500 hover:underline">
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}