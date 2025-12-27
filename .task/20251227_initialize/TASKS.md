# Chrono Agent 開発タスク一覧

## Phase 1: 基盤セットアップと Linear 連携 (Collector)

### 1.1 プロジェクト初期化
- [x] Tauri + Next.js プロジェクトの作成
- [x] TypeScript 設定
- [x] ESLint / Prettier 設定
- [x] Shadcn/ui のセットアップ

### 1.2 Supabase セットアップ
- [ ] Supabase プロジェクトの作成（ユーザー側で作成）
- [x] 環境変数の設定 (.env.example 作成)
- [x] Supabase クライアントの初期化

### 1.3 データベース設計
- [x] tasks テーブルの作成
- [x] daily_schedules テーブルの作成
- [x] pomodoro_logs テーブルの作成
- [x] RLS (Row Level Security) ポリシーの設定

### 1.4 認証機能
- [x] Supabase Auth の設定
- [x] ログイン/ログアウト UI の実装

### 1.5 Collector エージェント
- [x] Linear API 連携
- [x] Linear からタスクを Supabase に同期する機能

---

## Phase 2: ポモドーロ・スケジューリング (Planner)

### 2.1 VoltAgent セットアップ
- [ ] VoltAgent の導入
- [ ] Vercel AI SDK の設定

### 2.2 Planner エージェント
- [ ] カレンダーの空き時間取得ロジック
- [ ] ポモドーロ単位のスケジュール生成
- [ ] daily_schedules への保存

### 2.3 ポモドーロタイマー UI
- [ ] タイマーコンポーネントの実装
- [ ] 開始/停止/リセット機能
- [ ] pomodoro_logs への記録

---

## Phase 3: Notion 連携と RAG (Refiner)

### 3.1 Notion 連携
- [ ] Notion API 連携
- [ ] Notion からのデータ取得

### 3.2 RAG 実装
- [ ] pgvector のセットアップ
- [ ] Embedding 生成
- [ ] ベクトル検索の実装

### 3.3 Refiner エージェント
- [ ] タスクを具体的ステップに分解するロジック
- [ ] 過去ログからのコンテキスト取得

---

## Phase 4: ネイティブ機能実装

### 4.1 メニューバー
- [ ] Tauri メニューバーアプリ化
- [ ] 通知機能

### 4.2 ホットキー
- [ ] グローバルホットキーの設定
- [ ] タイマー操作のショートカット

### 4.3 フォーカスモード
- [ ] フォーカスモード UI
- [ ] 通知のミュート機能

---

## その他

### ドキュメント
- [ ] API ドキュメントの作成
- [ ] コントリビューションガイドの作成

### テスト
- [ ] ユニットテストのセットアップ
- [ ] E2E テストのセットアップ
