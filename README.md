# Chrono Agent

AI エージェントによるタスク管理・実行プラットフォーム

## コンセプト

「分散したタスクを集約し、AIが実行可能な計画を立て、人間が集中して完結させる」ための、個人専用AIエージェント・プラットフォーム。

## 必要環境

- Node.js 20+
- Rust (Tauri用)
- Supabase アカウント

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/chrono-agent.git
cd chrono-agent

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env を編集して Supabase の認証情報を設定

# 開発サーバーの起動
npm run dev
```

## アーキテクチャ：エージェント・パイプライン

単一の巨大なAIではなく、特定の役割を持つエージェントが Supabase をハブとしてデータを更新・連携し合う構成。

### 各エージェントの役割

| エージェント | 役割 |
|------------|------|
| **Orchestrator** | ユーザーの依頼を受け、適切なエージェントを呼び出す |
| **Collector** | Linear, JIRA, Google Calendar から情報を Supabase に同期 |
| **Refiner** | Notionや過去ログをRAGで参照し、タスクを具体的ステップに分解 |
| **Planner** | カレンダーの空き時間に基づき、ポモドーロ単位のスケジュールを提案 |
| **Tracker** | Tauri上のタイマーと連動し、進捗の記録と再調整を行う |

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | Tauri + Next.js (App Router) / Shadcn/ui |
| エージェントロジック | VoltAgent (TypeScript / Vercel AI SDK) |
| バックエンド/DB | Supabase (PostgreSQL, Auth, pgvector, Edge Functions) |
| 外部認証 | Supabase Vault (OAuth連携用) |
| インターフェース | MCP (Model Context Protocol) による拡張性確保 |

## データモデル

### tasks（集約されたタスク）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| user_id | uuid | ユーザーID |
| source | enum | 'linear', 'jira', 'inbox' |
| title | string | タスク名 |
| estimated_pomodoros | integer | 見積もりポモドーロ数 |
| status | string | ステータス |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### daily_schedules（AIが生成した計画）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| user_id | uuid | ユーザーID |
| date | date | 日付 |
| slots | jsonb | タイムスロット、タスクID、タイプ |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### pomodoro_logs（実行実績）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| task_id | uuid | タスクID |
| started_at | timestamp | 開始日時 |
| completed_at | timestamp | 完了日時 |
| feedback | text | AIへのフィードバック用 |

## 開発ロードマップ

| フェーズ | 内容 |
|---------|------|
| Phase 1 | Tauri + Supabase の基盤セットアップと Linear 連携 (Collector) |
| Phase 2 | VoltAgent によるポモドーロ・スケジューリングロジックの実装 (Planner) |
| Phase 3 | Notion 連携と RAG によるタスク具体化機能の追加 (Refiner) |
| Phase 4 | メニューバー通知、ホットキー、フォーカスモード等のネイティブ機能実装 |

## ライセンス

MIT

---

## コーディングエージェントへの指示

「このドキュメントに基づき、まずはプロジェクトのディレクトリ構造を作成し、Tauri と Next.js の基本セットアップを行ってください。その後、Supabase のテーブル定義を作成してください。」
