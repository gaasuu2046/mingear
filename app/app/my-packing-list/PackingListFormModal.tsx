// app/my-packing-list/PackingListFormModal.tsx
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

import { PackingList, Trip } from './types'

interface PackingListFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<PackingList>) => void;
  packingList?: PackingList | null;
  trips: Trip[];
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    width: '100%',
  },
};

export default function PackingListFormModal({ isOpen, onClose, onSubmit, packingList, trips = [] }: PackingListFormModalProps) {
  const [formData, setFormData] = useState<Partial<PackingList>>({
    name: '',
    detail: '',
    season: 'UNSPECIFIED',
    tripId: undefined,
  })

  useEffect(() => {
    if (packingList) {
      setFormData({
        name: packingList.name,
        detail: packingList.detail || '',
        season: packingList.season,
        tripId: packingList.tripId,
      })
    } else {
      setFormData({
        name: '',
        detail: '',
        season: 'UNSPECIFIED',
        tripId: undefined,
      })
    }
  }, [packingList])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="パッキングリストフォーム"
    >
      <h2 className="text-2xl font-bold mb-4">{packingList ? 'パッキングリスト編集' : '新規パッキングリスト作成'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">リスト名</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="block mb-2">詳細</label>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="season" className="block mb-2">シーズン</label>
          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="SPRING">春</option>
            <option value="SUMMER">夏</option>
            <option value="AUTUMN">秋</option>
            <option value="WINTER">冬</option>
            <option value="UNSPECIFIED">指定なし</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="tripId" className="block mb-2">旅程</label>
          <select
            id="tripId"
            name="tripId"
            value={formData.tripId || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </form>
    </Modal>
  )
}
