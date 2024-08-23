// app/page.tsx
import GearList from '@/app/gear/page'

export default function Home() {
  return (
    <div>
      <GearList limit={12}/>
    </div>
  )
}
