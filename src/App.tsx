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

  const statusColors: Record<string, string> = {
    '未着手': '#8B9467',
    '進行中': '#4573D2',
    'レビュー中': '#9B59B6',
    '完了': '#2ECC71',
    '保留': '#E67E22',
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <nav
        className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700 shadow-sm"
        style={{ padding: '0 32px' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4573D2 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              施
            </div>
            <span
              className="text-slate-900 dark:text-slate-100"
              style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              施策管理
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {darkMode ? 'ライト' : 'ダーク'}
            </button>
            <button
              onClick={handleAddNew}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#4573D2',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(69,115,210,0.3)',
              }}
            >
              + 新規施策
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1
            className="text-slate-900 dark:text-slate-100"
            style={{ fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}
          >
            チーム施策の進捗を一元管理
          </h1>
          <p
            className="text-slate-500 dark:text-slate-400"
            style={{ marginTop: '8px', fontSize: '14px' }}
          >
            ステータス・担当者・優先度で絞り込み、カードから詳細をすばやく確認・編集できます。
          </p>
        </header>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}
        >
          {['未着手', '進行中', 'レビュー中', '完了', '保留'].map((status) => (
            <div
              key={status}
              className="bg-white dark:bg-slate-800 shadow-sm"
              style={{
                borderLeft: `4px solid ${statusColors[status]}`,
                borderRadius: '8px',
                padding: '16px 20px',
              }}
            >
              <p
                className="text-slate-500 dark:text-slate-400"
                style={{ fontSize: '13px', margin: 0, fontWeight: 500 }}
              >
                {status}
              </p>
              <p
                className="text-slate-900 dark:text-slate-100"
                style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, margin: '8px 0 0 0' }}
              >
                {statusCounts[status] || 0}
              </p>
            </div>
          ))}
        </div>

        <div
          className="bg-white dark:bg-slate-800 shadow-sm"
          style={{
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveTab('list')}
              className={
                activeTab === 'list'
                  ? 'text-white'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
              }
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'list' ? '#4573D2' : undefined,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              一覧ビュー
            </button>
            <button
              onClick={() => setActiveTab('assignee')}
              className={
                activeTab === 'assignee'
                  ? 'text-white'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
              }
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'assignee' ? '#4573D2' : undefined,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              担当者ビュー
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', minWidth: '240px' }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <FilterBar filters={filters} onChange={setFilters} measures={measures} />
          </div>
          <div
            className="text-slate-500 dark:text-slate-400"
            style={{ marginTop: '12px', fontSize: '13px' }}
          >
            {filteredMeasures.length} 件の施策が表示中（全 {measures.length} 件）
          </div>
        </div>

        <div
          className="bg-white dark:bg-slate-800 shadow-sm"
          style={{
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          {activeTab === 'list' ? (
            filteredMeasures.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" style={{ display: 'grid', gap: '16px' }}>
                {filteredMeasures.map(measure => (
                  <MeasureCard
                    key={measure.id}
                    measure={measure}
                    onClick={() => handleCardClick(measure)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                style={{
                  borderRadius: '12px',
                  padding: '48px 24px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>検索結果はありません</p>
                <p style={{ marginTop: '8px', margin: '8px 0 0 0' }}>フィルター条件を確認するか、新しい施策を追加してください。</p>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {Object.entries(groupedByAssignee).map(([assignee, measures]) => (
                <div key={assignee}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <p
                        className="text-slate-500 dark:text-slate-400"
                        style={{ fontSize: '13px', margin: 0 }}
                      >
                        担当者
                      </p>
                      <h2
                        className="text-slate-900 dark:text-slate-100"
                        style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 0 0' }}
                      >
                        {assignee}
                      </h2>
                    </div>
                    <div
                      className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {measures.length} 件の施策
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" style={{ display: 'grid', gap: '16px' }}>
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
        </div>

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
