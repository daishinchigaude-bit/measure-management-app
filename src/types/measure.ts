export interface Measure {
  id: string
  title: string
  requester?: string
  assignee: string
  priority: '高' | '中' | '低'
  status: '未着手' | '進行中' | 'レビュー中' | '完了' | '保留'
  problem?: string
  system_detail?: string
  effect?: string
  estimated_duration?: string
  actual_duration?: string
  last_updated?: string
  notes?: string
  created_at: string
}