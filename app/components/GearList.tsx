// components/GearList.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function GearList() {
  const [gears, setGears] = useState([])

  useEffect(() => {
    fetch('/api/gear')
      .then(res => res.json())
      .then(data => setGears(data))
  }, [])

  return (
    <ul>
      {gears.map(gear => (
        <li key={gear.id}>
          <Link href={`/gear/${gear.id}`}>
            {gear.name} - {gear.brand}
          </Link>
        </li>
      ))}
    </ul>
  )
}