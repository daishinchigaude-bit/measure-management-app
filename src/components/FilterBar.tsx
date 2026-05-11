import type { Measure } from '../types/measure'

interface FilterBarProps {
  filters: {
    assignee: string
    priority: string
    status: string
  }
  onChange: (filters: FilterBarProps['filters']) => void
  measures: Measure[]
}

const FilterBar = ({ filters, onChange, measures }: FilterBarProps) => {
  // ユニークな担当者を取得
  const assignees = Array.from(new Set(measures.map(m => m.assignee)))

  const handleChange = (key: keyof typeof filters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex gap-4">
      <select
        value={filters.assignee}
        onChange={(e) => handleChange('assignee', e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">担当者: すべて</option>
        {assignees.map(assignee => (
          <option key={assignee} value={assignee}>{assignee}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleChange('priority', e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">優先度: すべて</option>
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">ステータス: すべて</option>
        <option value="未着手">未着手</option>
        <option value="進行中">進行中</option>
        <option value="レビュー中">レビュー中</option>
        <option value="完了">完了</option>
        <option value="保留">保留</option>
      </select>
    </div>
  )
}

export default FilterBar