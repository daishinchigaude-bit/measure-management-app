import { useState, useEffect } from 'react'
import type { Measure } from './types/measure'
import { fetchMeasures, insertInitialData, addMeasure, updateMeasure, deleteMeasure } from './lib/measures'
import MeasureCard from './components/MeasureCard'
import MeasureModal from './components/MeasureModal'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'

function App() {
  const [measures, setMeasures] = useState<Measure[]>([])
  const [filteredMeasures, setFilteredMeasures] = useState<Measure[]>([])
  const [selectedMeasure, setSelectedMeasure] = useState<Measure | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: ''
  })
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'assignee'>('list')

  // 初期データ投入とデータ取得
  useEffect(() => {
    const init = async () => {
      await insertInitialData()
      const data = await fetchMeasures()
      setMeasures(data)
      setFilteredMeasures(data)
    }
    init()
  }, [])

  // フィルタリングと検索の適用
  useEffect(() => {
    let filtered = measures

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.assignee) {
      filtered = filtered.filter(m => m.assignee === filters.assignee)
    }

    if (filters.priority) {
      filtered = filtered.filter(m => m.priority === filters.priority)
    }

    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status)
    }

    setFilteredMeasures(filtered)
  }, [measures, searchQuery, filters])

  // ダークモード切り替え
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleCardClick = (measure: Measure) => {
    setSelectedMeasure(measure)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedMeasure(null)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleSave = async (measure: Omit<Measure, 'id' | 'created_at'>) => {
    if (selectedMeasure) {
      // 更新
      const updated = await updateMeasure(selectedMeasure.id, measure)
      if (updated) {
        setMeasures(measures.map(m => m.id === selectedMeasure.id ? updated : m))
      }
    } else {
      // 新規追加
      const newMeasure = await addMeasure(measure)
      if (newMeasure) {
        setMeasures([newMeasure, ...measures])
      }
    }
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    if (selectedMeasure && window.confirm('本当に削除しますか？')) {
      const success = await deleteMeasure(selectedMeasure.id)
      if (success) {
        setMeasures(measures.filter(m => m.id !== selectedMeasure.id))
        setIsModalOpen(false)
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  // ステータス別の件数サマリー
  const statusCounts = measures.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 担当者別のグループ化
  const groupedByAssignee = filteredMeasures.reduce((acc, measure) => {
    if (!acc[measure.assignee]) {
      acc[measure.assignee] = []
    }
    acc[measure.assignee].push(measure)
    return acc
  }, {} as Record<string, Measure[]>)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">施策管理</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {darkMode ? 'ライトモード' : 'ダークモード'}
            </button>
          </div>

          {/* ステータスサマリー */}
          <div className="flex gap-4 mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-sm">
                {status}: {count}
              </div>
            ))}
          </div>

          {/* タブ */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              一覧ビュー
            </button>
            <button
              onClick={() => setActiveTab('assignee')}
              className={`px-4 py-2 rounded ${activeTab === 'assignee' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              担当者ビュー
            </button>
          </div>

          {/* フィルターと検索 */}
          <div className="flex flex-wrap gap-4 mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar filters={filters} onChange={setFilters} measures={measures} />
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + 新規施策を追加
            </button>
          </div>
        </header>

        {/* コンテンツ */}
        {activeTab === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeasures.map(measure => (
              <MeasureCard
                key={measure.id}
                measure={measure}
                onClick={() => handleCardClick(measure)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByAssignee).map(([assignee, measures]) => (
              <div key={assignee}>
                <h2 className="text-xl font-semibold mb-4">{assignee} の施策</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {measures.map(measure => (
                    <MeasureCard
                      key={measure.id}
                      measure={measure}
                      onClick={() => handleCardClick(measure)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 詳細モーダル */}
        {isModalOpen && (
          <MeasureModal
            measure={selectedMeasure}
            isEditing={isEditing}
            onSave={handleSave}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App
