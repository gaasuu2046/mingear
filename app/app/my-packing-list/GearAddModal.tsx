'use client'

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

// モーダルのスタイルを設定
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

export default function GearAddModal({ isOpen, onClose, onAddGear, userId }) {
  const [gearName, setGearName] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedGear, setSelectedGear] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement(document.body);
    }
    if (gearName.length > 2) {
      fetchSuggestions(gearName)
    } else {
      setSuggestions([])
    }
  }, [gearName])

  const fetchSuggestions = async (query) => {
    const response = await fetch(`/api/gear/search?q=${query}&userId=${userId}`)
    const data = await response.json()
    setSuggestions(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedGear) {
      onAddGear(selectedGear)
    } else {
      // 選択されていない場合は、新しいギアとして扱う
      onAddGear({ name: gearName, type: 'personal' })
    }
    onClose()
  }

  const handleGearSelect = (gear) => {
    setGearName(gear.name)
    setSelectedGear(gear)
    setSuggestions([])
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="ギアを追加"
    >
      <h2 className="text-lg font-medium mb-4">ギアを追加</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={gearName}
          onChange={(e) => {
            setGearName(e.target.value)
            setSelectedGear(null)  // 入力が変更されたら選択をリセット
          }}
          placeholder="ギア名で検索"
          className="w-full p-2 border rounded mb-4"
        />
        
        {suggestions.length > 0 && (
            <div className="mb-4 border rounded max-h-60 overflow-y-auto">
            <ul>
              {suggestions.map((gear) => (
                <li
                  key={gear.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleGearSelect(gear)}
                >
                  {gear.img ? (
                    <img 
                      src={gear.img} 
                      alt={gear.name} 
                      className="w-8 h-8 object-cover mr-2 rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 mr-2 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No img</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">{gear.name}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({gear.type === 'personal' ? '所有ギア' : 'カタログ'})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
          追加
        </button>
      </form>
    </Modal>
  )
}
