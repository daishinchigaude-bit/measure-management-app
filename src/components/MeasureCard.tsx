import type { Measure } from '../types/measure'

// 優先度の色を取得
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '高': return 'bg-red-500'
    case '中': return 'bg-yellow-500'
    case '低': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

// ステータスの色を取得
const getStatusColor = (status: string) => {
  switch (status) {
    case '未着手': return 'bg-gray-500'
    case '進行中': return 'bg-blue-500'
    case 'レビュー中': return 'bg-purple-500'
    case '完了': return 'bg-green-500'
    case '保留': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

// アバターの初期を取得
const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase()
}

interface MeasureCardProps {
  measure: Measure
  onClick: () => void
}

const MeasureCard = ({ measure, onClick }: MeasureCardProps) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{measure.title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
            {getInitials(measure.assignee)}
          </div>
          <span className="text-sm">{measure.assignee}</span>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs text-white rounded ${getPriorityColor(measure.priority)}`}>
            {measure.priority}
          </span>
          <span className={`px-2 py-1 text-xs text-white rounded ${getStatusColor(measure.status)}`}>
            {measure.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MeasureCard