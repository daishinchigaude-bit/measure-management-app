import { supabase } from './supabase'
import type { Measure } from '../types/measure'

// 初期データ投入の重複実行を防ぐためのモジュール内ガード
// React StrictModeにより useEffect が2回実行されても1度しか走らないようにする
let initPromise: Promise<void> | null = null

// 初期データを挿入する関数
export const insertInitialData = async (): Promise<void> => {
  if (initPromise) return initPromise

  initPromise = (async () => {
    // まず既存データ件数をチェック
    const { count, error: countError } = await supabase
      .from('measures')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error checking initial data:', countError)
      return
    }

    // 既にデータが存在する場合はスキップ
    if ((count ?? 0) > 0) return

    const initialData: Omit<Measure, 'id' | 'created_at'>[] = [
      {
        title: '経理自動化システム',
        assignee: '山田',
        priority: '高',
        status: '進行中',
        last_updated: new Date().toISOString().split('T')[0],
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

    const { error: insertError } = await supabase.from('measures').insert(initialData)
    if (insertError) {
      console.error('Error inserting initial data:', insertError)
    }
  })()

  return initPromise
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