// components/AddToPackingListButton.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Modal from 'react-modal'

interface AddToPackingListButtonProps {
  gearId: number;
  type: 'public' | 'personal';
  className?: string;
}

interface PackingList {
  id: number;
  name: string;
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
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    padding: '20px',
    borderRadius: '8px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

export default function AddToPackingListButton({ gearId, type, className }: AddToPackingListButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [packingLists, setPackingLists] = useState<PackingList[]>([])
  const [selectedLists, setSelectedLists] = useState<number[]>([])
  const { data: session } = useSession()
  const [isLoadingLists, setIsLoadingLists] = useState(false)


  const fetchPackingLists = async () => {
    if (!session) return;

    setIsLoadingLists(true)  // データ取得開始時にローディング状態をtrueに設定
    try {
      const response = await fetch('/api/packing-list')
      if (response.ok) {
        const lists = await response.json()
        setPackingLists(lists)
      } else {
        throw new Error('Failed to fetch packing lists')
      }
    } catch (error) {
      console.error('Error fetching packing lists:', error)
      alert('パッキングリストの取得に失敗しました')
    } finally {
      setIsLoadingLists(false)
    }
  }

  const handleOpenModal = async () => {
    if (!session) {
      // ログインページへのリダイレクト処理
      return
    }
    setIsModalOpen(true)
    await fetchPackingLists()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLists([])
  }

  const handleListSelection = (listId: number) => {
    setSelectedLists(prev =>
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }

  const handleAddToPackingLists = async () => {
    setIsLoading(true)
    try {
      const results = await Promise.all(selectedLists.map(listId =>
        fetch(`/api/packing-list/${listId}/add-gear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gearId, type }),
        })
      ))

      if (results.every(res => res.ok)) {
        alert('選択したパッキングリストにギアが追加されました')
        handleCloseModal()
      } else {
        throw new Error('Some packing lists failed to update')
      }
    } catch (error) {
      console.error('Error adding to packing lists:', error)
      alert('パッキングリストへの追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors ${className || ''}`}
      >
        パッキングリストに追加
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="パッキングリスト選択"
        style={customStyles}
      >
        <h2 className="text-xl font-bold mb-4">パッキングリストを選択</h2>
        {isLoadingLists ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {packingLists.map((list) => (
              <div key={list.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`list-${list.id}`}
                  checked={selectedLists.includes(list.id)}
                  onChange={() => handleListSelection(list.id)}
                  className="mr-2"
                />
                <label htmlFor={`list-${list.id}`}>{list.name}</label>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddToPackingLists}
            disabled={isLoading || selectedLists.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mr-2"
          >
            {isLoading ? '追加中...' : '登録'}
          </button>
          <button
            onClick={handleCloseModal}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </Modal>
    </>
  )
}
