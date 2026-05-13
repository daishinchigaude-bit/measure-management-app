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
  const assignees = Array.from(new Set(measures.map(m => m.assignee)))

  const handleChange = (key: keyof typeof filters, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const selectClass = "h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto sm:min-w-[160px]"

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:flex-none lg:items-center">
      <select
        value={filters.assignee}
        onChange={(e) => handleChange('assignee', e.target.value)}
        className={selectClass}
      >
        <option value="">担当者: すべて</option>
        {assignees.map(assignee => (
          <option key={assignee} value={assignee}>{assignee}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleChange('priority', e.target.value)}
        className={selectClass}
      >
        <option value="">優先度: すべて</option>
        <option value="高">高</option>
        <option value="中">中</option>
        <option value="低">低</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
        className={selectClass}
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