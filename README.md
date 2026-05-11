# 施策管理Webアプリ

Googleスプレッドシートで管理していた「施策管理表」を、チーム全員がどのデバイスからでも同じデータを見・編集できるWebアプリに作り直しました。

## 技術スタック

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## 機能

### 一覧画面
- 施策をカード形式で表示
- 各カードに施策名、担当者（アバター付き）、優先度バッジ、ステータスバッジを表示
- ステータス別の件数サマリー
- 担当者・優先度・ステータスでのフィルタリング
- キーワード検索
- 新規施策追加ボタン
- 一覧ビューと担当者ビュー（タブ切り替え）

### 詳細モーダル
- 全フィールドの表示・編集
- 編集・削除ボタン（削除は確認ダイアログ）
- 最終更新日自動更新

## セットアップ

1. リポジトリをクローン
2. 依存関係をインストール: `npm install`
3. `.env`ファイルを作成し、Supabaseの接続情報を設定:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. SupabaseのSQL Editorで以下のテーブルを作成:
   ```sql
   create table measures (
     id uuid default gen_random_uuid() primary key,
     title text not null,
     requester text,
     assignee text not null,
     priority text check (priority in ('高', '中', '低')),
     status text not null check (status in ('未着手', '進行中', 'レビュー中', '完了', '保留')),
     problem text,
     system_detail text,
     effect text,
     estimated_duration text,
     actual_duration text,
     last_updated date,
     notes text,
     created_at timestamp with time zone default now()
   );
   ```
5. 開発サーバーを起動: `npm run dev`

## 使用方法

- ブラウザで http://localhost:5173 にアクセス
- 初期データが自動投入されます
- カードをクリックして詳細を表示・編集
- 「+ 新規施策を追加」ボタンで新しい施策を追加
- フィルターと検索で施策を絞り込み
- ダークモード切り替え可能

## 特徴

- レスポンシブデザイン（スマホ1列・PC3列）
- ダークモード対応
- リアルタイムデータ同期（Supabase）
- 最終更新日降順ソート
- 担当者別ビュー
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
