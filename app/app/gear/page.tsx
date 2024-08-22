// app/gear/page.tsx
import Link from 'next/link'

const gears = [
  { id: 1, name: 'テント', brand: 'アウトドアブランドA', rating: 4.5 },
  { id: 2, name: '寝袋', brand: 'アウトドアブランドB', rating: 4.2 },
  { id: 3, name: 'バックパック', brand: 'アウトドアブランドC', rating: 4.8 },
  { id: 4, name: 'トレッキングポール', brand: 'アウトドアブランドD', rating: 4.3 },
  { id: 5, name: 'UL靴', brand: 'アウトドアブランドE', rating: 4.6 },
  { id: 6, name: 'ヘッドランプ', brand: 'アウトドアブランドF', rating: 4.1 },
]

export default function GearList() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mt-6">ギア一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gears.map((gear) => (
          <div key={gear.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{gear.name}</h2>
            <p className="text-gray-600 mb-2">{gear.brand}</p>
            <p className="text-yellow-500 mb-2">{'★'.repeat(Math.round(gear.rating))}{'☆'.repeat(5 - Math.round(gear.rating))}</p>
            <Link href={`/gear/${gear.id}`} className="text-blue-500 hover:underline">
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}