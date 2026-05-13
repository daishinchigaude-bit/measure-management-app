import { useState } from 'react'
import type { Measure } from '../types/measure'

const statusBorderColors: Record<string, string> = {
  '未着手': '#8B9467',
  '進行中': '#4573D2',
  'レビュー中': '#9B59B6',
  '完了': '#2ECC71',
  '保留': '#E67E22',
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '高': return 'bg-red-500/90 text-white'
    case '中': return 'bg-yellow-400 text-slate-900'
    case '低': return 'bg-emerald-500/90 text-white'
    default: return 'bg-slate-400 text-white'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '未着手': return 'bg-slate-400 text-white'
    case '進行中': return 'bg-sky-500 text-white'
    case 'レビュー中': return 'bg-violet-500 text-white'
    case '完了': return 'bg-emerald-500 text-white'
    case '保留': return 'bg-orange-500 text-white'
    default: return 'bg-slate-400 text-white'
  }
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface MeasureCardProps {
  measure: Measure
  onClick: () => void
}

const MeasureCard = ({ measure, onClick }: MeasureCardProps) => {
  const [hovered, setHovered] = useState(false)
  const borderColor = statusBorderColors[measure.status] || '#9ca3af'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: '10px',
        borderLeft: `4px solid ${borderColor}`,
        padding: '18px 20px',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 8px 20px rgba(0,0,0,0.12)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.4 }}>
          {measure.title}
        </p>
        <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280', margin: '6px 0 0 0' }}>
          最終更新: {measure.last_updated || '未設定'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#4573D2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(measure.assignee)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827', margin: 0 }}>{measure.assignee}</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>担当者</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getPriorityColor(measure.priority)}`}
          >
            {measure.priority}
          </span>
          <span
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(measure.status)}`}
          >
            {measure.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MeasureCard
