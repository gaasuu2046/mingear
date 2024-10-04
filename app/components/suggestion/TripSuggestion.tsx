// components/TripSuggestion.tsx
'use client'

import { useState, useEffect } from 'react'

interface Trip {
  plan_id: string;
  place: string;
  start: string;
  end: string;
}

export function TripSuggestion({ onSelect }: { onSelect: (trip: Trip) => void }) {
  const [suggestions, setSuggestions] = useState<Trip[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search) {
      fetchSuggestions(search)
    } else {
      setSuggestions([])
    }
  }, [search])

  async function fetchSuggestions(query: string) {
    try {
      const response = await fetch(`/api/trip-suggestions?q=${query}`)
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Failed to fetch trip suggestions:', error)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="山行や登山計画を検索"
      />
      <ul>
        {suggestions.map((trip) => (
          <li key={trip.plan_id} onClick={() => onSelect(trip)}>
            {trip.place} - {trip.start} 〜 {trip.end}
          </li>
        ))}
      </ul>
    </div>
  )
}
