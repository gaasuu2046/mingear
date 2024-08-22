// components/GearForm.tsx
import { useState } from 'react'

export default function GearForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, category, brand }),
    })
    if (response.ok) {
      alert('ギアが登録されました')
      setName('')
      setDescription('')
      setCategory('')
      setBrand('')
    } else {
      alert('ギアの登録に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>新しいギアを登録</h2>
      <div>
        <label htmlFor="name">名前:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">説明:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category">カテゴリー:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="brand">ブランド:</label>
        <input
          type="text"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
      </div>
      <button type="submit">登録</button>
    </form>
  )
}

