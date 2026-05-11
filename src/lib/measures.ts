import { supabase } from './supabase'
import type { Measure } from '../types/measure'

// 初期データを挿入する関数
export const insertInitialData = async () => {
  const initialData: Omit<Measure, 'id' | 'created_at'>[] = [
    {
      title: '経理自動化システム',
      assignee: '山田',
      priority: '高',
      status: '進行中',
      last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    },
    {
      title: '営業管理システム',
      assignee: '中',
      priority: '中',
      status: '進行中',
      last_updated: new Date().toISOString().split('T')[0],
    },
    {
      title: '新人研修マニュアル・チャットボット',
      assignee: '茂原',
      priority: '中',
      status: '未着手',
      last_updated: new Date().toISOString().split('T')[0],
    },
  ]

  // 既存データをチェック
  const { data: existing, error } = await supabase.from('measures').select('id')

  if (error) {
    console.error('Error checking initial data:', error)
    return
  }

  // データが0件のときのみ初期投入
  if (!existing || existing.length === 0) {
    await supabase.from('measures').insert(initialData)
  }
}

// 施策データを取得する関数
export const fetchMeasures = async (): Promise<Measure[]> => {
  const { data, error } = await supabase
    .from('measures')
    .select('*')
    .order('last_updated', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Error fetching measures:', error)
    return []
  }

  return data || []
}

// 施策を追加する関数
export const addMeasure = async (measure: Omit<Measure, 'id' | 'created_at'>): Promise<Measure | null> => {
  const now = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('measures')
    .insert({ ...measure, last_updated: now })
    .select()
    .single()

  if (error) {
    console.error('Error adding measure:', error)
    return null
  }

  return data
}

// 施策を更新する関数
export const updateMeasure = async (id: string, updates: Partial<Measure>): Promise<Measure | null> => {
  const { data, error } = await supabase
    .from('measures')
    .update({ ...updates, last_updated: new Date().toISOString().split('T')[0] })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating measure:', error)
    return null
  }

  return data
}

// 施策を削除する関数
export const deleteMeasure = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('measures')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting measure:', error)
    return false
  }

  return true
}