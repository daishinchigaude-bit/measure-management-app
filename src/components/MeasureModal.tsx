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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px' }}
    >
      <div
        className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        style={{ width: '100%', maxWidth: '720px', background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {measure ? (isEditing ? '施策を編集' : '施策詳細') : '新しい施策を追加'}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              下記の項目を入力・更新して、施策の状態を管理します。
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            閉じる
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">施策の名前</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">依頼者の名前</label>
                <input
                  type="text"
                  value={formData.requester}
                  onChange={(e) => handleChange('requester', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">担当者</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">優先度</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value as '高' | '中' | '低')}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">ステータス</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as Measure['status'])}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="未着手">未着手</option>
                  <option value="進行中">進行中</option>
                  <option value="レビュー中">レビュー中</option>
                  <option value="完了">完了</option>
                  <option value="保留">保留</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">予想工期</label>
                <input
                  type="text"
                  value={formData.estimated_duration}
                  onChange={(e) => handleChange('estimated_duration', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">実際の工期</label>
                <input
                  type="text"
                  value={formData.actual_duration}
                  onChange={(e) => handleChange('actual_duration', e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">問題点</label>
                <textarea
                  value={formData.problem}
                  onChange={(e) => handleChange('problem', e.target.value)}
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">システムの内容</label>
                <textarea
                  value={formData.system_detail}
                  onChange={(e) => handleChange('system_detail', e.target.value)}
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">効果</label>
                <textarea
                  value={formData.effect}
                  onChange={(e) => handleChange('effect', e.target.value)}
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">備考</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="mt-2 h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="submit" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                保存する
              </button>
              {measure && (
                <button type="button" onClick={onDelete} className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
                  削除する
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">施策の名前</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{measure?.title}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">担当者</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{measure?.assignee}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">依頼者</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.requester || '未設定'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">優先度</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.priority}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">ステータス</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.status}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">予想工期</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.estimated_duration || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">実際の工期</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.actual_duration || '-'}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">最終更新日</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.last_updated || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">問題点</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.problem || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">システムの内容</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.system_detail || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">効果</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.effect || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">備考</p>
                <p className="mt-2 text-base text-slate-900 dark:text-slate-100">{measure?.notes || '-'}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onEdit}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                編集する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeasureModal