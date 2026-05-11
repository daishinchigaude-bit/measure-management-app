import { useState, useEffect } from 'react'
import type { Measure } from '../types/measure'

interface MeasureModalProps {
  measure: Measure | null
  isEditing: boolean
  onSave: (measure: Omit<Measure, 'id' | 'created_at'>) => void
  onDelete: () => void
  onEdit: () => void
  onClose: () => void
}

const MeasureModal = ({ measure, isEditing, onSave, onDelete, onEdit, onClose }: MeasureModalProps) => {
  const [formData, setFormData] = useState<Omit<Measure, 'id' | 'created_at'>>({
    title: '',
    requester: '',
    assignee: '',
    priority: '中',
    status: '未着手',
    problem: '',
    system_detail: '',
    effect: '',
    estimated_duration: '',
    actual_duration: '',
    last_updated: '',
    notes: '',
  })

  useEffect(() => {
    if (measure) {
      setFormData({
        title: measure.title,
        requester: measure.requester || '',
        assignee: measure.assignee,
        priority: measure.priority,
        status: measure.status,
        problem: measure.problem || '',
        system_detail: measure.system_detail || '',
        effect: measure.effect || '',
        estimated_duration: measure.estimated_duration || '',
        actual_duration: measure.actual_duration || '',
        last_updated: measure.last_updated || '',
        notes: measure.notes || '',
      })
    } else {
      // 新規の場合
      setFormData({
        title: '',
        requester: '',
        assignee: '',
        priority: '中',
        status: '未着手',
        problem: '',
        system_detail: '',
        effect: '',
        estimated_duration: '',
        actual_duration: '',
        last_updated: '',
        notes: '',
      })
    }
  }, [measure])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {measure ? (isEditing ? '施策編集' : '施策詳細') : '新規施策追加'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">施策の名前</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">依頼者の名前</label>
                <input
                  type="text"
                  value={formData.requester}
                  onChange={(e) => handleChange('requester', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">担当者</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">優先度</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value as '高' | '中' | '低')}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ステータス</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as Measure['status'])}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="未着手">未着手</option>
                  <option value="進行中">進行中</option>
                  <option value="レビュー中">レビュー中</option>
                  <option value="完了">完了</option>
                  <option value="保留">保留</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">予想工期</label>
                <input
                  type="text"
                  value={formData.estimated_duration}
                  onChange={(e) => handleChange('estimated_duration', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">実際の工期</label>
                <input
                  type="text"
                  value={formData.actual_duration}
                  onChange={(e) => handleChange('actual_duration', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">問題点</label>
              <textarea
                value={formData.problem}
                onChange={(e) => handleChange('problem', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">システムの内容</label>
              <textarea
                value={formData.system_detail}
                onChange={(e) => handleChange('system_detail', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">効果</label>
              <textarea
                value={formData.effect}
                onChange={(e) => handleChange('effect', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">備考</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                保存
              </button>
              {measure && (
                <button type="button" onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  削除
                </button>
              )}
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><strong>施策の名前:</strong> {measure?.title}</div>
              <div><strong>依頼者の名前:</strong> {measure?.requester}</div>
              <div><strong>担当者:</strong> {measure?.assignee}</div>
              <div><strong>優先度:</strong> {measure?.priority}</div>
              <div><strong>ステータス:</strong> {measure?.status}</div>
              <div><strong>予想工期:</strong> {measure?.estimated_duration}</div>
              <div><strong>実際の工期:</strong> {measure?.actual_duration}</div>
              <div><strong>最終更新日:</strong> {measure?.last_updated}</div>
            </div>
            <div className="mb-4"><strong>問題点:</strong> {measure?.problem}</div>
            <div className="mb-4"><strong>システムの内容:</strong> {measure?.system_detail}</div>
            <div className="mb-4"><strong>効果:</strong> {measure?.effect}</div>
            <div className="mb-4"><strong>備考:</strong> {measure?.notes}</div>
            <button onClick={onEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              編集
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeasureModal